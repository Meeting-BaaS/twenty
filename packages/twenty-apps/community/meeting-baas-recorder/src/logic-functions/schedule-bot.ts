import axios from 'axios';
import { MeetingBaasApiClient } from '../meeting-baas-api-client';
import { resolveCalendarEventOwner } from '../twenty-sync-service';
import { createLogger } from '../logger';
import { getRestApiUrl, restHeaders } from '../utils';

const logger = createLogger('schedule-bot');

type RecordingPreference = 'RECORD_ALL' | 'RECORD_ORGANIZED' | 'RECORD_NONE';

type BotSettings = {
  preference: RecordingPreference;
  botName: string;
  botEntryMessage: string;
};

const TWENTY_API_KEY = process.env.TWENTY_API_KEY ?? '';

const fetchWorkspaceMemberBotSettings = async (
  workspaceMemberId: string,
): Promise<BotSettings> => {
  try {
    const response = await axios({
      method: 'GET',
      headers: restHeaders(),
      url: `${getRestApiUrl()}/workspaceMembers/${workspaceMemberId}`,
    });
    const memberData = response.data?.data ?? response.data;
    return {
      preference: (memberData?.recordingPreference as RecordingPreference) ?? 'RECORD_NONE',
      botName: (memberData?.botName as string) || 'Twenty CRM Recorder',
      botEntryMessage: (memberData?.botEntryMessage as string) || '',
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.warn(`Failed to fetch workspace member bot settings: ${msg}`);
    return { preference: 'RECORD_NONE', botName: 'Twenty CRM Recorder', botEntryMessage: '' };
  }
};

const fetchCalendarEventTitle = async (
  calendarEventId: string,
): Promise<string> => {
  try {
    const response = await axios({
      method: 'GET',
      headers: restHeaders(),
      url: `${getRestApiUrl()}/calendarEvents/${calendarEventId}`,
    });
    const eventData = response.data?.data ?? response.data;
    return (eventData?.title as string) || '';
  } catch {
    return '';
  }
};

const isOrganizer = async (
  calendarEventId: string,
  workspaceMemberId: string,
): Promise<boolean> => {
  try {
    const response = await axios({
      method: 'GET',
      headers: { Authorization: `Bearer ${TWENTY_API_KEY}` },
      url: `${getRestApiUrl()}/calendarEventParticipants?filter=calendarEventId%5Beq%5D%3A%22${encodeURIComponent(calendarEventId)}%22&limit=50`,
    });
    const participants: Record<string, unknown>[] =
      response.data?.data?.calendarEventParticipants ?? [];

    return participants.some(
      (p) =>
        p.isOrganizer === true &&
        p.workspaceMemberId === workspaceMemberId,
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.warn(`Failed to check organizer status: ${msg}`);
    return false;
  }
};

// Shared handler: resolve owner → check preference → check organizer → schedule bot
export const scheduleBot = async (
  calendarEventId: string,
  conferenceUrl: string,
  startsAt: string,
): Promise<string | null> => {
  const apiKey = process.env.MEETING_BAAS_API_KEY;
  if (!apiKey) {
    logger.debug('MEETING_BAAS_API_KEY not set, skipping bot scheduling');
    return null;
  }

  // Resolve calendar event owner
  const ownership = await resolveCalendarEventOwner(calendarEventId);
  if (!ownership.workspaceMemberId) {
    logger.debug(`No workspace member found for calendar event ${calendarEventId}`);
    return null;
  }

  // Check recording preference and bot settings
  const { preference, botName, botEntryMessage } = await fetchWorkspaceMemberBotSettings(ownership.workspaceMemberId);
  if (preference === 'RECORD_NONE') {
    logger.debug(`Workspace member ${ownership.workspaceMemberName ?? ownership.workspaceMemberId} has recording disabled`);
    return null;
  }

  // If organizer-only, check if the member is the organizer
  if (preference === 'RECORD_ORGANIZED') {
    const memberIsOrganizer = await isOrganizer(calendarEventId, ownership.workspaceMemberId);
    if (!memberIsOrganizer) {
      logger.debug(`Workspace member ${ownership.workspaceMemberName ?? ownership.workspaceMemberId} is not the organizer, skipping`);
      return null;
    }
  }

  // Fetch calendar event title for recording metadata
  const meetingTitle = await fetchCalendarEventTitle(calendarEventId);

  // Schedule the bot
  const client = new MeetingBaasApiClient(apiKey);
  const botId = await client.createScheduledBot({
    meetingUrl: conferenceUrl,
    joinAt: startsAt,
    botName,
    ...(botEntryMessage && { entryMessage: botEntryMessage }),
    extra: {
      calendarEventId,
      workspaceMemberId: ownership.workspaceMemberId,
      meeting_url: conferenceUrl,
      meeting_title: meetingTitle,
    },
  });

  logger.debug(`Scheduled bot ${botId} for calendar event ${calendarEventId} (${conferenceUrl})`);
  return botId;
};
