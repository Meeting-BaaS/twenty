import { CALL_RECORDER_NAME_ENV_VAR_NAME } from 'src/logic-functions/constants/call-recorder-name-env-var-name';
import { DEFAULT_CALL_RECORDER_NAME } from 'src/logic-functions/constants/default-call-recorder-name';
import { MEETING_BAAS_API_BASE_URL_ENV_VAR_NAME } from 'src/logic-functions/constants/meeting-baas-api-base-url-env-var-name';
import { MEETING_BAAS_API_KEY_ENV_VAR_NAME } from 'src/logic-functions/constants/meeting-baas-api-key-env-var-name';
import { MEETING_BAAS_CALLBACK_SECRET_ENV_VAR_NAME } from 'src/logic-functions/constants/meeting-baas-callback-secret-env-var-name';
import { MEETING_BAAS_CALLBACK_URL_ENV_VAR_NAME } from 'src/logic-functions/constants/meeting-baas-callback-url-env-var-name';
import { getApplicationVariableValue } from 'src/logic-functions/utils/get-application-variable-value.util';
import { isNonEmptyString } from 'src/logic-functions/utils/is-non-empty-string.util';

export type MeetingBaasApiConfig = {
  apiKey: string;
  baseUrl: string;
  botName: string;
  callbackUrl: string;
  callbackSecret: string;
};

export const getMeetingBaasApiConfig = ():
  | { success: true; config: MeetingBaasApiConfig }
  | { success: false; error: string } => {
  const apiKey = getApplicationVariableValue(MEETING_BAAS_API_KEY_ENV_VAR_NAME);

  if (!isNonEmptyString(apiKey)) {
    return {
      success: false,
      error:
        'MEETING_BAAS_API_KEY server variable is not set. Set it when CALL_RECORDER_PROVIDER is meeting-baas.',
    };
  }

  const callbackUrl = getApplicationVariableValue(
    MEETING_BAAS_CALLBACK_URL_ENV_VAR_NAME,
  );

  if (!isNonEmptyString(callbackUrl)) {
    return {
      success: false,
      error:
        'MEETING_BAAS_CALLBACK_URL server variable is not set. Set it to the absolute meeting-baas-webhook URL.',
    };
  }

  const callbackSecret = getApplicationVariableValue(
    MEETING_BAAS_CALLBACK_SECRET_ENV_VAR_NAME,
  );

  if (!isNonEmptyString(callbackSecret)) {
    return {
      success: false,
      error:
        'MEETING_BAAS_CALLBACK_SECRET server variable is not set. It must match x-mb-secret.',
    };
  }

  const rawBaseUrl = getApplicationVariableValue(
    MEETING_BAAS_API_BASE_URL_ENV_VAR_NAME,
  );
  const rawBotName = getApplicationVariableValue(CALL_RECORDER_NAME_ENV_VAR_NAME);

  return {
    success: true,
    config: {
      apiKey,
      baseUrl: normalizeBaseUrl(rawBaseUrl),
      botName: isNonEmptyString(rawBotName)
        ? rawBotName.trim()
        : DEFAULT_CALL_RECORDER_NAME,
      callbackUrl: callbackUrl.trim(),
      callbackSecret,
    },
  };
};

const normalizeBaseUrl = (rawBaseUrl: string | undefined): string => {
  const baseUrl = isNonEmptyString(rawBaseUrl)
    ? rawBaseUrl.trim()
    : 'https://api.meetingbaas.com';

  return baseUrl.replace(/\/+$/, '');
};
