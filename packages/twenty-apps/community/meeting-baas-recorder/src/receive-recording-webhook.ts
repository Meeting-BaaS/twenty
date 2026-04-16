import { defineLogicFunction } from 'twenty-sdk';
import type { ProcessResult } from './types';
import { WebhookHandler } from './webhook-handler';

export default defineLogicFunction({
  universalIdentifier: '0c0c376e-3d0a-5348-b6a7-3b4f35b33f9e',
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
