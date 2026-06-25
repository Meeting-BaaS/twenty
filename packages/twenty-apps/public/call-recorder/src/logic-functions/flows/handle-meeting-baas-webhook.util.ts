import { isUndefined } from '@sniptt/guards';
import { type CoreApiClient } from 'twenty-client-sdk/core';

import { CallRecordingStatus } from 'src/logic-functions/constants/call-recording-status';
import { findCallRecordingsByFilter } from 'src/logic-functions/data/find-call-recordings-by-filter.util';
import {
  updateCallRecording,
  type CallRecordingUpdateFields,
} from 'src/logic-functions/data/update-call-recording.util';
import { isCallRecordingStatusDowngrade } from 'src/logic-functions/domain/is-call-recording-status-downgrade.util';
import { mapMeetingBaasStatusToCallRecordingStatus } from 'src/logic-functions/domain/map-meeting-baas-status-to-call-recording-status.util';
import { ingestCallRecordingMediaFromUrls } from 'src/logic-functions/flows/ingest-call-recording-media.util';
import {
  parseMeetingBaasWebhookEvent,
  type MeetingBaasWebhookBody,
  type MeetingBaasWebhookEvent,
} from 'src/logic-functions/meeting-baas-api/parse-meeting-baas-webhook-event.util';
import { normalizeMeetingBaasTranscript } from 'src/logic-functions/meeting-baas-api/normalize-meeting-baas-transcript.util';
import { type CallRecordingRecord } from 'src/logic-functions/types/call-recording-record.type';

type MeetingBaasWebhookHandlerResult =
  | { status: 'updated'; callRecordingId: string }
  | { status: 'skipped'; reason: string };

export const handleMeetingBaasWebhook = async ({
  client,
  body,
}: {
  client: CoreApiClient;
  body: MeetingBaasWebhookBody;
}): Promise<MeetingBaasWebhookHandlerResult> => {
  const webhookEvent = parseMeetingBaasWebhookEvent(body);

  if (isUndefined(webhookEvent)) {
    return { status: 'skipped', reason: 'unsupported Meeting BaaS payload' };
  }

  const callRecording = await findMatchingCallRecording({
    client,
    webhookEvent,
  });

  if (isUndefined(callRecording)) {
    return { status: 'skipped', reason: 'no matching call recording' };
  }

  const status = mapEventToStatus(webhookEvent);

  if (isUndefined(status)) {
    return {
      status: 'skipped',
      reason: `unsupported Meeting BaaS event ${webhookEvent.event}`,
    };
  }

  if (
    isCallRecordingStatusDowngrade({
      fromStatus: callRecording.status,
      toStatus: status,
    })
  ) {
    return { status: 'skipped', reason: 'stale status event' };
  }

  const updateData: CallRecordingUpdateFields = {
    status,
    ...(isUndefined(webhookEvent.externalBotId)
      ? {}
      : { externalBotId: webhookEvent.externalBotId }),
    ...(isUndefined(webhookEvent.externalRecordingId)
      ? {}
      : { externalRecordingId: webhookEvent.externalRecordingId }),
    ...buildRecordingTimestampsUpdate({ callRecording, webhookEvent }),
    ...(status === CallRecordingStatus.FAILED
      ? { callRecorderFailureReason: webhookEvent.failureReason ?? null }
      : {}),
  };

  if (status === CallRecordingStatus.COMPLETED) {
    Object.assign(
      updateData,
      await ingestCallRecordingMediaFromUrls({
        callRecordingId: callRecording.id,
        hasAudio: false,
        hasVideo: false,
        audioUrl: webhookEvent.audioUrl,
        videoUrl: webhookEvent.videoUrl,
      }),
    );

    const transcript = await resolveTranscript(webhookEvent);

    if (!isUndefined(transcript)) {
      updateData.transcript = normalizeTranscriptUpdate(transcript);
    }
  }

  await updateCallRecording(client, {
    id: callRecording.id,
    data: updateData,
  });

  return { status: 'updated', callRecordingId: callRecording.id };
};

const findMatchingCallRecording = async ({
  client,
  webhookEvent,
}: {
  client: CoreApiClient;
  webhookEvent: MeetingBaasWebhookEvent;
}): Promise<CallRecordingRecord | undefined> => {
  if (!isUndefined(webhookEvent.callRecordingIdFromMetadata)) {
    return (
      await findCallRecordingsByFilter(client, {
        id: { eq: webhookEvent.callRecordingIdFromMetadata },
      })
    )[0];
  }

  if (isUndefined(webhookEvent.externalBotId)) {
    return undefined;
  }

  return (
    await findCallRecordingsByFilter(client, {
      externalBotId: { eq: webhookEvent.externalBotId },
    })
  )[0];
};

const mapEventToStatus = (
  webhookEvent: MeetingBaasWebhookEvent,
): CallRecordingStatus | undefined => {
  if (webhookEvent.event === 'bot.completed') {
    return CallRecordingStatus.COMPLETED;
  }

  if (webhookEvent.event === 'bot.failed') {
    return CallRecordingStatus.FAILED;
  }

  return mapMeetingBaasStatusToCallRecordingStatus(webhookEvent.status);
};

const buildRecordingTimestampsUpdate = ({
  callRecording,
  webhookEvent,
}: {
  callRecording: CallRecordingRecord;
  webhookEvent: MeetingBaasWebhookEvent;
}): Pick<CallRecordingUpdateFields, 'startedAt' | 'endedAt'> => ({
  ...(isUndefined(callRecording.startedAt) &&
  !isUndefined(webhookEvent.startedAt)
    ? { startedAt: webhookEvent.startedAt }
    : {}),
  ...(isUndefined(callRecording.endedAt) && !isUndefined(webhookEvent.endedAt)
    ? { endedAt: webhookEvent.endedAt }
    : {}),
});

const resolveTranscript = async (
  webhookEvent: MeetingBaasWebhookEvent,
): Promise<unknown> => {
  if (!isUndefined(webhookEvent.transcript)) {
    return webhookEvent.transcript;
  }

  const transcriptUrl =
    webhookEvent.transcriptionUrl ?? webhookEvent.rawTranscriptionUrl;

  if (isUndefined(transcriptUrl)) {
    return undefined;
  }

  try {
    const response = await fetch(transcriptUrl, {
      signal: AbortSignal.timeout(120_000),
    });

    if (!response.ok) {
      return undefined;
    }

    return await response.json();
  } catch {
    return undefined;
  }
};

const normalizeTranscriptUpdate = (
  transcript: unknown,
): Record<string, unknown> =>
  normalizeMeetingBaasTranscript(transcript) as Record<string, unknown>;
