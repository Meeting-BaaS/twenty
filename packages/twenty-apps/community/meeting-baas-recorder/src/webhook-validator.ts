import { createHash } from 'crypto';
import { WebhookEvent, type MeetingBaasWebhookPayload } from './types';

const VALID_WEBHOOK_EVENTS: MeetingBaasWebhookPayload['event'][] = [
  WebhookEvent.COMPLETED,
  WebhookEvent.FAILED,
  WebhookEvent.STATUS_CHANGE,
];

export type SignatureVerificationResult = {
  isValid: boolean;
  reason?: string;
};

// Meeting BaaS authenticates webhooks by including the API key
// in the x-meeting-baas-api-key header. We verify it matches our configured key.
export const verifyWebhookApiKey = (
  providedKey: string | undefined,
  expectedKey: string
): SignatureVerificationResult => {
  if (!providedKey) {
    return { isValid: false, reason: 'missing x-meeting-baas-api-key header' };
  }

  if (!expectedKey) {
    return { isValid: false, reason: 'MEETING_BAAS_API_KEY not configured' };
  }

  const isValid = providedKey === expectedKey;

  return { isValid, reason: isValid ? undefined : 'API key mismatch' };
};

export const getApiKeyFingerprint = (apiKey: string): string => {
  return createHash('sha256').update(apiKey).digest('hex').substring(0, 8);
};

export const isValidMeetingBaasPayload = (
  params: unknown
): params is MeetingBaasWebhookPayload => {
  if (!params || typeof params !== 'object') {
    return false;
  }

  const payload = params as Record<string, unknown>;

  // Must have 'event' field with valid V2 event type
  if (typeof payload['event'] !== 'string' || payload['event'].length === 0) {
    return false;
  }

  if (!VALID_WEBHOOK_EVENTS.includes(payload['event'] as MeetingBaasWebhookPayload['event'])) {
    return false;
  }

  // Must have 'data' object with bot_id
  if (!payload['data'] || typeof payload['data'] !== 'object') {
    return false;
  }

  const data = payload['data'] as Record<string, unknown>;
  return typeof data['bot_id'] === 'string' && data['bot_id'].length > 0;
};
