import {
  scheduleMeetingBaasBot,
  type ScheduleMeetingBaasBotArgs,
} from 'src/logic-functions/meeting-baas-api/schedule-meeting-baas-bot.util';
import { getMeetingBaasApiConfig } from 'src/logic-functions/meeting-baas-api/get-meeting-baas-api-config.util';
import { meetingBaasApiRequest } from 'src/logic-functions/meeting-baas-api/meeting-baas-api-request.util';
import { type RecallBotScheduleResult } from 'src/logic-functions/types/recall-bot-operation-result.type';

type RescheduleMeetingBaasBotArgs = ScheduleMeetingBaasBotArgs & {
  externalBotId: string;
};

export const rescheduleMeetingBaasBot = async ({
  externalBotId,
  meetingUrl,
  joinAt,
  metadata,
}: RescheduleMeetingBaasBotArgs): Promise<RecallBotScheduleResult> => {
  const configResult = getMeetingBaasApiConfig();

  if (!configResult.success) {
    return { ok: false, status: null, errorMessage: configResult.error };
  }

  const result = await meetingBaasApiRequest<undefined>({
    config: configResult.config,
    path: `/v2/bots/scheduled/${externalBotId}`,
    method: 'PATCH',
    body: {
      meeting_url: meetingUrl,
      join_at: joinAt,
      bot_name: configResult.config.botName,
      callback_enabled: true,
      callback_config: {
        url: configResult.config.callbackUrl,
        secret: configResult.config.callbackSecret,
        method: 'POST',
      },
      extra: metadata,
    },
  });

  if (result.ok) {
    return { ok: true, externalBotId };
  }

  if (result.status === 404) {
    return scheduleMeetingBaasBot({ meetingUrl, joinAt, metadata });
  }

  return result;
};
