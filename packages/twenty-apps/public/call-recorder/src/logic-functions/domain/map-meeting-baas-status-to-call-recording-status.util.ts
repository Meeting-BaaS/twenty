import { CallRecordingStatus } from 'src/logic-functions/constants/call-recording-status';

export const mapMeetingBaasStatusToCallRecordingStatus = (
  status: string | undefined,
): CallRecordingStatus | undefined => {
  switch (status) {
    case 'queued':
      return CallRecordingStatus.SCHEDULED;
    case 'joining':
      return CallRecordingStatus.JOINING;
    case 'in_call_recording':
      return CallRecordingStatus.RECORDING;
    case 'transcribing':
      return CallRecordingStatus.PROCESSING;
    case 'completed':
      return CallRecordingStatus.COMPLETED;
    case 'failed':
      return CallRecordingStatus.FAILED;
    default:
      return undefined;
  }
};
