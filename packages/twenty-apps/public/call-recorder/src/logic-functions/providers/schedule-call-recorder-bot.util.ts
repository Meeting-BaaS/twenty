import { scheduleMeetingBaasBot } from 'src/logic-functions/meeting-baas-api/schedule-meeting-baas-bot.util';
import { scheduleRecallBot } from 'src/logic-functions/recall-api/schedule-recall-bot.util';
import { type RecallBotMetadata } from 'src/logic-functions/types/recall-bot-metadata.type';
import { type RecallBotScheduleResult } from 'src/logic-functions/types/recall-bot-operation-result.type';
import { getCallRecorderProvider } from 'src/logic-functions/providers/get-call-recorder-provider.util';

export const scheduleCallRecorderBot = async ({
  meetingUrl,
  joinAt,
  metadata,
}: {
  meetingUrl: string;
  joinAt: string;
  metadata: RecallBotMetadata;
}): Promise<RecallBotScheduleResult> => {
  if (getCallRecorderProvider() === 'meeting-baas') {
    return scheduleMeetingBaasBot({ meetingUrl, joinAt, metadata });
  }

  return scheduleRecallBot({ meetingUrl, joinAt, metadata });
};
