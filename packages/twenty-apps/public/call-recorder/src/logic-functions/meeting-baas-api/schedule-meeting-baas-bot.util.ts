import { isUndefined } from '@sniptt/guards';

import { CALL_RECORDER_EVERYONE_LEFT_TIMEOUT_SECONDS } from 'src/logic-functions/constants/call-recorder-everyone-left-timeout-seconds';
import { CALL_RECORDER_EVERYONE_LEFT_TIMEOUT_SECONDS_ENV_VAR_NAME } from 'src/logic-functions/constants/call-recorder-everyone-left-timeout-seconds-env-var-name';
import { CALL_RECORDER_NOONE_JOINED_TIMEOUT_SECONDS } from 'src/logic-functions/constants/call-recorder-noone-joined-timeout-seconds';
import { CALL_RECORDER_NOONE_JOINED_TIMEOUT_SECONDS_ENV_VAR_NAME } from 'src/logic-functions/constants/call-recorder-noone-joined-timeout-seconds-env-var-name';
import { CALL_RECORDER_WAITING_ROOM_TIMEOUT_SECONDS } from 'src/logic-functions/constants/call-recorder-waiting-room-timeout-seconds';
import { CALL_RECORDER_WAITING_ROOM_TIMEOUT_SECONDS_ENV_VAR_NAME } from 'src/logic-functions/constants/call-recorder-waiting-room-timeout-seconds-env-var-name';
import { getApplicationVariableValue } from 'src/logic-functions/utils/get-application-variable-value.util';
import { isNonEmptyString } from 'src/logic-functions/utils/is-non-empty-string.util';
import { getMeetingBaasApiConfig } from 'src/logic-functions/meeting-baas-api/get-meeting-baas-api-config.util';
import { meetingBaasApiRequest } from 'src/logic-functions/meeting-baas-api/meeting-baas-api-request.util';
import { type RecallBotMetadata } from 'src/logic-functions/types/recall-bot-metadata.type';
import { type RecallBotScheduleResult } from 'src/logic-functions/types/recall-bot-operation-result.type';

type MeetingBaasScheduledBotResponse = {
  data?: {
    bot_id?: string;
  };
};

export type ScheduleMeetingBaasBotArgs = {
  meetingUrl: string;
  joinAt: string;
  metadata: RecallBotMetadata;
};

export const scheduleMeetingBaasBot = async ({
  meetingUrl,
  joinAt,
  metadata,
}: ScheduleMeetingBaasBotArgs): Promise<RecallBotScheduleResult> => {
  const configResult = getMeetingBaasApiConfig();

  if (!configResult.success) {
    return { ok: false, status: null, errorMessage: configResult.error };
  }

  const result = await meetingBaasApiRequest<MeetingBaasScheduledBotResponse>({
    config: configResult.config,
    path: '/v2/bots/scheduled',
    method: 'POST',
    body: {
      meeting_url: meetingUrl,
      join_at: joinAt,
      bot_name: configResult.config.botName,
      recording_mode: 'speaker_view',
      transcription_enabled: true,
      callback_enabled: true,
      callback_config: {
        url: configResult.config.callbackUrl,
        secret: configResult.config.callbackSecret,
        method: 'POST',
      },
      timeout_config: {
        waiting_room_timeout: getPositiveIntegerVariable(
          CALL_RECORDER_WAITING_ROOM_TIMEOUT_SECONDS_ENV_VAR_NAME,
          CALL_RECORDER_WAITING_ROOM_TIMEOUT_SECONDS,
        ),
        no_one_joined_timeout: getPositiveIntegerVariable(
          CALL_RECORDER_NOONE_JOINED_TIMEOUT_SECONDS_ENV_VAR_NAME,
          CALL_RECORDER_NOONE_JOINED_TIMEOUT_SECONDS,
        ),
        silence_timeout: getPositiveIntegerVariable(
          CALL_RECORDER_EVERYONE_LEFT_TIMEOUT_SECONDS_ENV_VAR_NAME,
          CALL_RECORDER_EVERYONE_LEFT_TIMEOUT_SECONDS,
        ),
      },
      extra: metadata,
    },
  });

  if (!result.ok) {
    return result;
  }

  const externalBotId = result.data?.data?.bot_id;

  if (isUndefined(externalBotId)) {
    return {
      ok: false,
      status: null,
      errorMessage:
        'Meeting BaaS created a scheduled bot but did not return data.bot_id',
    };
  }

  return { ok: true, externalBotId };
};

const getPositiveIntegerVariable = (
  envVarName: string,
  fallback: number,
): number => {
  const rawValue = getApplicationVariableValue(envVarName);

  if (!isNonEmptyString(rawValue)) {
    return fallback;
  }

  const parsed = Number(rawValue.trim());

  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};
