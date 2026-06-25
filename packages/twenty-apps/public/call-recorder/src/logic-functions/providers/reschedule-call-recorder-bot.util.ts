import { rescheduleMeetingBaasBot } from 'src/logic-functions/meeting-baas-api/reschedule-meeting-baas-bot.util';
import { rescheduleRecallBot } from 'src/logic-functions/recall-api/reschedule-recall-bot.util';
import { type RecallBotMetadata } from 'src/logic-functions/types/recall-bot-metadata.type';
import { type RecallBotScheduleResult } from 'src/logic-functions/types/recall-bot-operation-result.type';
import { getCallRecorderProvider } from 'src/logic-functions/providers/get-call-recorder-provider.util';

export const rescheduleCallRecorderBot = async ({
  externalBotId,
  meetingUrl,
  joinAt,
  metadata,
}: {
  externalBotId: string;
  meetingUrl: string;
  joinAt: string;
  metadata: RecallBotMetadata;
}): Promise<RecallBotScheduleResult> => {
  if (getCallRecorderProvider() === 'meeting-baas') {
    return rescheduleMeetingBaasBot({
      externalBotId,
      meetingUrl,
      joinAt,
      metadata,
    });
  }

  return rescheduleRecallBot({
    externalBotId,
    meetingUrl,
    joinAt,
    metadata,
  });
};
