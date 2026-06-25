import { isUndefined } from '@sniptt/guards';
import { type CoreApiClient } from 'twenty-client-sdk/core';

import { CallRecordingRequestStatus } from 'src/logic-functions/constants/call-recording-request-status';
import { type CallRecordingRecord } from 'src/logic-functions/types/call-recording-record.type';
import { cancelCallRecorderBot } from 'src/logic-functions/providers/cancel-call-recorder-bot.util';
import { updateCallRecording } from 'src/logic-functions/data/update-call-recording.util';

// Intent-first: the stale-state cron finishes the provider half when this call fails.
export const cancelCallRecordingRequest = async ({
  client,
  callRecording,
}: {
  client: CoreApiClient;
  callRecording: CallRecordingRecord;
}): Promise<void> => {
  await updateCallRecording(client, {
    id: callRecording.id,
    data: {
      recordingRequestStatus: CallRecordingRequestStatus.CANCELED,
    },
  });

  if (isUndefined(callRecording.externalBotId)) {
    return;
  }

  const cancelResult = await cancelCallRecorderBot({
    externalBotId: callRecording.externalBotId,
  });

  if (!cancelResult.ok) {
    console.warn(
      `[call-recorder] failed to cancel provider bot for callRecording ${callRecording.id}, leaving it for the stale-state cron: ${cancelResult.errorMessage}`,
    );

    return;
  }

  await updateCallRecording(client, {
    id: callRecording.id,
    data: {
      externalBotId: null,
    },
  });
};
