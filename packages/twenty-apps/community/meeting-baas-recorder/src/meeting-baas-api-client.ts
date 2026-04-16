import axios from 'axios';
import { createBaasClient, type BaasClient, type V2 } from '@meeting-baas/sdk';
import { createLogger } from './logger';
import type { MeetingPlatform, RecordingData } from './types';
import { detectPlatform } from './twenty-sync-service';

const logger = createLogger('meeting-baas-api');

export class MeetingBaasApiClient {
  private client: BaasClient<'v2'>;

  constructor(apiKey: string) {
    if (!apiKey) {
      logger.critical('MEETING_BAAS_API_KEY is required but not provided');
      throw new Error('MEETING_BAAS_API_KEY is required');
    }
    this.client = createBaasClient({
      api_key: apiKey,
      api_version: 'v2',
      timeout: 60000,
    }) as BaasClient<'v2'>;
  }

  // Create a scheduled bot to join a meeting at a specific time
  async createScheduledBot(options: {
    meetingUrl: string;
    joinAt: string;
    botName?: string;
    entryMessage?: string;
    recordingMode?: 'speaker_view' | 'gallery_view' | 'audio_only';
    extra?: Record<string, unknown>;
    callbackUrl?: string;
  }): Promise<string> {
    logger.debug(`scheduling bot for meeting: ${options.meetingUrl} at ${options.joinAt}`);

    const result = await this.client.createScheduledBot({
      meeting_url: options.meetingUrl,
      join_at: options.joinAt,
      bot_name: options.botName || 'Twenty CRM Recorder',
      transcription_enabled: true,
      ...(options.entryMessage && { entry_message: options.entryMessage }),
      ...(options.recordingMode && { recording_mode: options.recordingMode }),
      ...(options.extra && { extra: options.extra }),
      ...(options.callbackUrl && {
        callback_enabled: true,
        callback_config: { url: options.callbackUrl },
      }),
    });

    if (!result.success) {
      const errorInfo = 'code' in result ? ` (${result.code})` : '';
      throw new Error(`Meeting BaaS API error${errorInfo}: ${result.error}`);
    }

    const botId = result.data.bot_id;
    logger.debug(`scheduled bot created with id: ${botId}`);
    return botId;
  }

  // Transform V2 bot.completed webhook data into normalized RecordingData
  async transformWebhookData(
    data: V2.BotWebhookCompletedData,
    extra?: Record<string, unknown> | null,
  ): Promise<RecordingData> {
    const duration = data.duration_seconds ?? 0;
    const extraData = extra ?? {};
    const meetingUrl = (extraData.meeting_url as string) || '';
    const title = (extraData.meeting_title as string) || `Recording ${new Date().toLocaleDateString()}`;
    const platform: MeetingPlatform = detectPlatform(meetingUrl);

    const transcript = await this.fetchTranscript(data);

    return {
      botId: data.bot_id,
      title,
      date: data.joined_at || new Date().toISOString(),
      duration,
      transcript,
      mp4Url: data.video || '',
      meetingUrl,
      platform,
      extra: extraData,
    };
  }

  // Fetch and format transcript from the signed URL provided in webhook data.
  // V2 webhook provides `transcription` as a signed URL to a JSON file
  // containing speaker-attributed segments.
  private async fetchTranscript(data: V2.BotWebhookCompletedData): Promise<string> {
    const transcriptionUrl = data.transcription;
    if (!transcriptionUrl) {
      logger.debug('no transcription URL in webhook data');
      return '';
    }

    try {
      logger.debug('fetching transcription from signed URL');
      const response = await axios.get(transcriptionUrl, { timeout: 30000 });
      const transcriptionData = response.data;

      // The transcription file is a JSON array of speaker segments:
      // [{ speaker: "Name", words: [{ start, end, word }] }, ...]
      if (Array.isArray(transcriptionData)) {
        return this.formatTranscriptSegments(transcriptionData);
      }

      // If it's a string (plain text transcript), return as-is
      if (typeof transcriptionData === 'string') {
        return transcriptionData;
      }

      logger.warn('unexpected transcription format, storing as JSON');
      return JSON.stringify(transcriptionData);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logger.warn(`failed to fetch transcription: ${message}`);
      return '';
    }
  }

  // Format transcript segments into readable speaker-attributed text
  private formatTranscriptSegments(
    segments: Array<{ speaker?: string; words?: Array<{ word: string }> }>,
  ): string {
    const lines: string[] = [];
    let currentSpeaker = '';

    for (const segment of segments) {
      const speaker = segment.speaker || 'Unknown';
      const text = segment.words?.map((w) => w.word).join(' ') || '';
      if (!text) continue;

      if (speaker !== currentSpeaker) {
        currentSpeaker = speaker;
        lines.push(`\n${speaker}:`);
      }
      lines.push(text);
    }

    return lines.join('\n').trim();
  }
}
