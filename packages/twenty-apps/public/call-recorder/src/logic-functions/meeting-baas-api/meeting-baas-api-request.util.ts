import { type MeetingBaasApiConfig } from 'src/logic-functions/meeting-baas-api/get-meeting-baas-api-config.util';

type MeetingBaasApiRequestArgs = {
  config: MeetingBaasApiConfig;
  path: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: Record<string, unknown>;
  allowNotFound?: boolean;
};

export type MeetingBaasApiRequestFailure = {
  ok: false;
  status: number | null;
  errorMessage: string;
};

export const meetingBaasApiRequest = async <TData>({
  config,
  path,
  method,
  body,
  allowNotFound = false,
}: MeetingBaasApiRequestArgs): Promise<
  | { ok: true; data: TData | undefined; status: number }
  | MeetingBaasApiRequestFailure
> => {
  try {
    const response = await fetch(`${config.baseUrl}${path}`, {
      method,
      headers: {
        'content-type': 'application/json',
        'x-meeting-baas-api-key': config.apiKey,
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });

    if (allowNotFound && response.status === 404) {
      return { ok: true, data: undefined, status: response.status };
    }

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        errorMessage: await extractMeetingBaasErrorMessage(response),
      };
    }

    if (response.status === 204) {
      return { ok: true, data: undefined, status: response.status };
    }

    return {
      ok: true,
      data: (await response.json()) as TData,
      status: response.status,
    };
  } catch (error) {
    return {
      ok: false,
      status: null,
      errorMessage: `Meeting BaaS API request failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
};

const extractMeetingBaasErrorMessage = async (
  response: Response,
): Promise<string> => {
  const fallback = `Meeting BaaS API responded with HTTP ${response.status}`;

  try {
    const body = (await response.json()) as unknown;

    if (
      typeof body === 'object' &&
      body !== null &&
      'error' in body &&
      typeof body.error === 'string'
    ) {
      return body.error;
    }

    if (
      typeof body === 'object' &&
      body !== null &&
      'message' in body &&
      typeof body.message === 'string'
    ) {
      return body.message;
    }
  } catch {
    return fallback;
  }

  return fallback;
};
