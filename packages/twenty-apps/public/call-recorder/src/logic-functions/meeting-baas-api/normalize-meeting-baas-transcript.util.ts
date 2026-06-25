import { isArray, isNumber, isUndefined } from '@sniptt/guards';

import { asRecord } from 'src/logic-functions/utils/as-record.util';
import { isNonEmptyString } from 'src/logic-functions/utils/is-non-empty-string.util';

type CallRecorderTranscript = Array<{
  participant: { name: string };
  words: Array<{
    text: string;
    start_timestamp?: { relative: number };
    end_timestamp?: { relative: number };
  }>;
}>;

export const normalizeMeetingBaasTranscript = (
  transcript: unknown,
): unknown => {
  const transcriptRecord = asRecord(transcript);
  const utterances =
    readUtterances(transcriptRecord?.result) ??
    readUtterances(transcriptRecord?.transcription) ??
    (isArray(transcript) ? transcript : undefined);

  if (isUndefined(utterances)) {
    return transcript;
  }

  const normalizedEntries = utterances
    .map(asRecord)
    .filter((utterance): utterance is Record<string, unknown> =>
      !isUndefined(utterance),
    )
    .map(normalizeUtterance)
    .filter(
      (entry): entry is CallRecorderTranscript[number] =>
        !isUndefined(entry),
    );

  return normalizedEntries.length > 0 ? normalizedEntries : transcript;
};

const readUtterances = (container: unknown): unknown[] | undefined => {
  const record = asRecord(container);

  return isArray(record?.utterances) ? record.utterances : undefined;
};

const normalizeUtterance = (
  utterance: Record<string, unknown>,
): CallRecorderTranscript[number] | undefined => {
  const words = isArray(utterance.words)
    ? utterance.words
        .map(asRecord)
        .filter((word): word is Record<string, unknown> => !isUndefined(word))
        .map(normalizeWord)
        .filter((word): word is CallRecorderTranscript[number]['words'][number] =>
          !isUndefined(word),
        )
    : [];

  if (words.length === 0 && isNonEmptyString(utterance.text)) {
    words.push({
      text: utterance.text.trim(),
      ...buildTimestamp('start_timestamp', utterance.start),
      ...buildTimestamp('end_timestamp', utterance.end),
    });
  }

  if (words.length === 0) {
    return undefined;
  }

  return {
    participant: {
      name: isNonEmptyString(utterance.speaker)
        ? utterance.speaker.trim()
        : 'Unknown speaker',
    },
    words,
  };
};

const normalizeWord = (
  word: Record<string, unknown>,
): CallRecorderTranscript[number]['words'][number] | undefined => {
  const text = isNonEmptyString(word.word)
    ? word.word
    : isNonEmptyString(word.text)
      ? word.text
      : undefined;

  if (isUndefined(text)) {
    return undefined;
  }

  return {
    text: text.trim(),
    ...buildTimestamp('start_timestamp', word.start),
    ...buildTimestamp('end_timestamp', word.end),
  };
};

const buildTimestamp = (
  key: 'start_timestamp' | 'end_timestamp',
  value: unknown,
): Partial<CallRecorderTranscript[number]['words'][number]> =>
  isNumber(value) && Number.isFinite(value)
    ? { [key]: { relative: value } }
    : {};
