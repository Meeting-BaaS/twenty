import { getMeetingBaasApiConfig } from 'src/logic-functions/meeting-baas-api/get-meeting-baas-api-config.util';
import { meetingBaasApiRequest } from 'src/logic-functions/meeting-baas-api/meeting-baas-api-request.util';

export type MeetingBaasBotDetails = Record<string, unknown>;

export const getMeetingBaasBot = async ({
  externalBotId,
}: {
  externalBotId: string;
}): Promise<
  | { ok: true; bot: MeetingBaasBotDetails }
  | { ok: false; status: number | null; errorMessage: string }
> => {
  const configResult = getMeetingBaasApiConfig();

  if (!configResult.success) {
    return { ok: false, status: null, errorMessage: configResult.error };
  }

  const result = await meetingBaasApiRequest<{
    data?: MeetingBaasBotDetails;
  }>({
    config: configResult.config,
    path: `/v2/bots/${externalBotId}`,
    method: 'GET',
  });

  if (!result.ok) {
    return result;
  }

  return { ok: true, bot: result.data?.data ?? {} };
};
