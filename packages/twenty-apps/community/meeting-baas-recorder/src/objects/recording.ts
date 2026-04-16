import { defineObject, FieldType } from 'twenty-sdk';

export const RECORDING_UNIVERSAL_IDENTIFIER =
  '0ec52997-4307-50a7-a929-85ad6f24b5d9';

// Field UUIDs — exported for use in views, relations, and page layouts
export const NAME_FIELD_ID = '6b04e869-c04e-5ebe-bfc4-7778a1108b17';
export const BOT_ID_FIELD_ID = '138d74e2-08b6-57e1-9eba-872c0747636f';
export const DATE_FIELD_ID = 'e9bce8f0-1a6d-507b-b0d8-00a9fc1386a5';
export const DURATION_FIELD_ID = '895cd235-1ad4-59b3-bfc9-8b2522d7d20f';
export const TRANSCRIPT_FIELD_ID = 'ebbc2924-3eb3-5895-b1b8-0cddb430fc9e';
export const MEETING_URL_FIELD_ID = 'ed410c1d-f23e-5d0a-8abd-699e8393edc8';
export const MP4_URL_FIELD_ID = 'ca9a9c4d-2aea-5b3e-9d27-22618f2095ee';
export const PLATFORM_FIELD_ID = '420c95de-9dbf-5eb5-b4fd-1327d0440941';
export const STATUS_FIELD_ID = '4c05856d-9182-5d40-bf27-07bc6f6457c3';

export default defineObject({
  universalIdentifier: RECORDING_UNIVERSAL_IDENTIFIER,
  nameSingular: 'recording',
  namePlural: 'recordings',
  labelSingular: 'Recording',
  labelPlural: 'Recordings',
  description: 'Meeting recordings from Meeting BaaS with transcripts and media.',
  icon: 'IconVideo',
  labelIdentifierFieldMetadataUniversalIdentifier: NAME_FIELD_ID,
  fields: [
    {
      universalIdentifier: NAME_FIELD_ID,
      type: FieldType.TEXT,
      label: 'Name',
      name: 'name',
      icon: 'IconAbc',
    },
    {
      universalIdentifier: BOT_ID_FIELD_ID,
      type: FieldType.TEXT,
      label: 'Bot ID',
      name: 'botId',
      icon: 'IconKey',
    },
    {
      universalIdentifier: DATE_FIELD_ID,
      type: FieldType.DATE_TIME,
      label: 'Date',
      name: 'date',
      icon: 'IconCalendar',
      isNullable: true,
      defaultValue: null,
    },
    {
      universalIdentifier: DURATION_FIELD_ID,
      type: FieldType.NUMBER,
      label: 'Duration (min)',
      name: 'duration',
      icon: 'IconClock',
    },
    {
      universalIdentifier: TRANSCRIPT_FIELD_ID,
      type: FieldType.TEXT,
      label: 'Transcript',
      name: 'transcript',
      icon: 'IconFileText',
    },
    {
      universalIdentifier: MEETING_URL_FIELD_ID,
      type: FieldType.LINKS,
      label: 'Meeting URL',
      name: 'meetingUrl',
      icon: 'IconLink',
    },
    {
      universalIdentifier: MP4_URL_FIELD_ID,
      type: FieldType.LINKS,
      label: 'Video Recording',
      name: 'mp4Url',
      icon: 'IconVideo',
    },
    {
      universalIdentifier: PLATFORM_FIELD_ID,
      type: FieldType.SELECT,
      label: 'Platform',
      name: 'platform',
      icon: 'IconDevices',
      options: [
        { id: '75e03212-d08e-5f37-8b1c-405229a2b3b6', value: 'GOOGLE_MEET', label: 'Google Meet', position: 0, color: 'blue' },
        { id: '30217257-f906-540a-b82a-8399e558fe4e', value: 'ZOOM', label: 'Zoom', position: 1, color: 'sky' },
        { id: 'b8971190-2e5a-5b52-a997-41bb0b227385', value: 'MICROSOFT_TEAMS', label: 'Microsoft Teams', position: 2, color: 'purple' },
        { id: '876a7992-ada9-5c28-a240-2e0843e66e15', value: 'UNKNOWN', label: 'Unknown', position: 3, color: 'gray' },
      ],
    },
    {
      universalIdentifier: STATUS_FIELD_ID,
      type: FieldType.SELECT,
      label: 'Status',
      name: 'status',
      icon: 'IconStatusChange',
      options: [
        { id: '9347a357-cea4-5ecd-843d-dd57687821b8', value: 'COMPLETED', label: 'Completed', position: 0, color: 'green' },
        { id: 'c1e846a4-159f-5d9d-b7ff-06120bf714f1', value: 'FAILED', label: 'Failed', position: 1, color: 'red' },
        { id: '28e99b5d-387f-5002-86ef-62478e95c69a', value: 'IN_PROGRESS', label: 'In Progress', position: 2, color: 'orange' },
      ],
    },
  ],
});
