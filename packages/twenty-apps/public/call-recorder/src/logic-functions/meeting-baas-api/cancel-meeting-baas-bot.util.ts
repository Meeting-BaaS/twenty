import { getMeetingBaasApiConfig } from 'src/logic-functions/meeting-baas-api/get-meeting-baas-api-config.util';
import { meetingBaasApiRequest } from 'src/logic-functions/meeting-baas-api/meeting-baas-api-request.util';
import { type RecallBotRemovalResult } from 'src/logic-functions/types/recall-bot-operation-result.type';

export const cancelMeetingBaasBot = async ({
  externalBotId,
}: {
  externalBotId: string;
}): Promise<RecallBotRemovalResult> => {
  const configResult = getMeetingBaasApiConfig();

  if (!configResult.success) {
    return { ok: false, status: null, errorMessage: configResult.error };
  }

  const result = await meetingBaasApiRequest<undefined>({
    config: configResult.config,
    path: `/v2/bots/scheduled/${externalBotId}`,
    method: 'DELETE',
    allowNotFound: true,
  });

  return result.ok ? { ok: true } : result;
};
