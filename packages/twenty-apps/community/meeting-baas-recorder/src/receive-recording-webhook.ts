import { defineLogicFunction } from 'twenty-sdk';
import type { ProcessResult } from './types';
import { WebhookHandler } from './webhook-handler';

export default defineLogicFunction({
  universalIdentifier: '3a4b5c6d-7e8f-9a0b-1c2d-3e4f5a6b7c8d',
  name: 'receive-recording-webhook',
  description:
    'Receives Meeting BaaS webhooks when recordings complete, and stores them in Twenty.',
  timeoutSeconds: 30,
  httpRouteTriggerSettings: {
    path: '/webhook/meeting-baas',
    httpMethod: 'POST',
    isAuthRequired: false,
  },
  handler: async (
    params: unknown,
    headers?: Record<string, string>,
  ): Promise<ProcessResult> => {
    const handler = new WebhookHandler();
    return handler.handle(params, headers);
  },
});
