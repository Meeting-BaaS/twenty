import { cancelMeetingBaasBot } from 'src/logic-functions/meeting-baas-api/cancel-meeting-baas-bot.util';
import { cancelRecallBot } from 'src/logic-functions/recall-api/cancel-recall-bot.util';
import { type RecallBotRemovalResult } from 'src/logic-functions/types/recall-bot-operation-result.type';
import { getCallRecorderProvider } from 'src/logic-functions/providers/get-call-recorder-provider.util';

export const cancelCallRecorderBot = async ({
  externalBotId,
}: {
  externalBotId: string;
}): Promise<RecallBotRemovalResult> => {
  if (getCallRecorderProvider() === 'meeting-baas') {
    return cancelMeetingBaasBot({ externalBotId });
  }

  return cancelRecallBot({ externalBotId });
};
