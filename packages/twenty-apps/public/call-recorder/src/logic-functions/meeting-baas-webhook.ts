import { isNull, isUndefined } from '@sniptt/guards';
import { CoreApiClient } from 'twenty-client-sdk/core';
import { defineLogicFunction, type RoutePayload } from 'twenty-sdk/define';
import { Response } from 'twenty-sdk/logic-function';

import { MEETING_BAAS_WEBHOOK_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIER } from 'src/constants/meeting-baas-webhook-logic-function-universal-identifier';
import { MEETING_BAAS_CALLBACK_SECRET_ENV_VAR_NAME } from 'src/logic-functions/constants/meeting-baas-callback-secret-env-var-name';
import { handleMeetingBaasWebhook } from 'src/logic-functions/flows/handle-meeting-baas-webhook.util';
import { type MeetingBaasWebhookBody } from 'src/logic-functions/meeting-baas-api/parse-meeting-baas-webhook-event.util';
import { getApplicationVariableValue } from 'src/logic-functions/utils/get-application-variable-value.util';
import { isNonEmptyString } from 'src/logic-functions/utils/is-non-empty-string.util';

const rejectWebhook = (status: number, error: string): Response => {
  console.error(`[call-recorder] Meeting BaaS webhook rejected: ${error}`);

  return new Response({ error }, { status });
};

export const meetingBaasWebhookRouteHandler = async (
  routePayload: RoutePayload<MeetingBaasWebhookBody>,
): Promise<object> => {
  const webhookSecret = getApplicationVariableValue(
    MEETING_BAAS_CALLBACK_SECRET_ENV_VAR_NAME,
  );

  if (!isNonEmptyString(webhookSecret)) {
    return rejectWebhook(
      500,
      'MEETING_BAAS_CALLBACK_SECRET server variable is not set.',
    );
  }

  if (routePayload.headers['x-mb-secret'] !== webhookSecret) {
    return rejectWebhook(401, 'Invalid Meeting BaaS callback secret');
  }

  if (isUndefined(routePayload.body) || isNull(routePayload.body)) {
    return rejectWebhook(400, 'Webhook payload was empty');
  }

  return handleMeetingBaasWebhook({
    client: new CoreApiClient(),
    body: routePayload.body,
  });
};

export default defineLogicFunction({
  universalIdentifier: MEETING_BAAS_WEBHOOK_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIER,
  name: 'meeting-baas-webhook',
  description:
    'Receives Meeting BaaS webhook events and updates the matching CallRecording lifecycle status.',
  timeoutSeconds: 30,
  handler: meetingBaasWebhookRouteHandler,
  serverWebhookTriggerSettings: {
    workspaceIdResolver: {
      source: 'body',
      path: 'data.extra.twentyWorkspaceId',
    },
    forwardedRequestHeaders: ['x-mb-secret'],
  },
});
