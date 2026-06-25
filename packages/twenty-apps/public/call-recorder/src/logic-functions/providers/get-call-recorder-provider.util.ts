import { CALL_RECORDER_PROVIDER_ENV_VAR_NAME } from 'src/logic-functions/constants/call-recorder-provider-env-var-name';
import { type CallRecorderProvider } from 'src/logic-functions/providers/call-recorder-provider.type';
import { getApplicationVariableValue } from 'src/logic-functions/utils/get-application-variable-value.util';

export const getCallRecorderProvider = (): CallRecorderProvider => {
  const rawProvider = getApplicationVariableValue(
    CALL_RECORDER_PROVIDER_ENV_VAR_NAME,
  );

  return rawProvider === 'meeting-baas' ? 'meeting-baas' : 'recall';
};
