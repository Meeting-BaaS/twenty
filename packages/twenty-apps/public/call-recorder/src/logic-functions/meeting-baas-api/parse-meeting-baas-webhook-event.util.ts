import { isUndefined } from '@sniptt/guards';

import { asRecord } from 'src/logic-functions/utils/as-record.util';
import { getString } from 'src/logic-functions/utils/get-string.util';
import { isNonEmptyString } from 'src/logic-functions/utils/is-non-empty-string.util';

export type MeetingBaasWebhookBody = Record<string, unknown>;

export type MeetingBaasWebhookEvent = {
  event: string;
  externalBotId: string | undefined;
  status: string | undefined;
  callRecordingIdFromMetadata: string | undefined;
  externalRecordingId: string | undefined;
  startedAt: string | undefined;
  endedAt: string | undefined;
  audioUrl: string | undefined;
  videoUrl: string | undefined;
  transcriptionUrl: string | undefined;
  rawTranscriptionUrl: string | undefined;
  transcript: unknown;
  failureReason: string | undefined;
};

export const parseMeetingBaasWebhookEvent = (
  body: MeetingBaasWebhookBody,
): MeetingBaasWebhookEvent | undefined => {
  const event = getString(body.event);

  if (isUndefined(event)) {
    return undefined;
  }

  const data = asRecord(body.data) ?? body;
  const extra = asRecord(data.extra) ?? asRecord(body.extra);

  return {
    event,
    externalBotId: getString(data.bot_id),
    status: getString(data.status),
    callRecordingIdFromMetadata: readMetadataString(
      extra,
      'twentyCallRecordingId',
    ),
    externalRecordingId: getString(data.bot_id),
    startedAt: getString(data.joined_at),
    endedAt: getString(data.exited_at),
    audioUrl: getString(data.audio),
    videoUrl: getString(data.video),
    transcriptionUrl: getString(data.transcription),
    rawTranscriptionUrl: getString(data.raw_transcription),
    transcript: data.transcript ?? data.transcription_content,
    failureReason:
      getString(data.error_message) ??
      getString(data.error_code) ??
      getString(data.status),
  };
};

const readMetadataString = (
  metadata: Record<string, unknown> | undefined,
  key: string,
): string | undefined => {
  const value = metadata?.[key];

  return isNonEmptyString(value) ? value.trim() : undefined;
};
