import { defineView } from 'twenty-sdk';
import { ViewKey, ViewType } from 'twenty-shared/types';
import {
  RECORDING_UNIVERSAL_IDENTIFIER,
  NAME_FIELD_ID,
  DATE_FIELD_ID,
  DURATION_FIELD_ID,
  PLATFORM_FIELD_ID,
  STATUS_FIELD_ID,
  MEETING_URL_FIELD_ID,
  MP4_URL_FIELD_ID,
} from '../objects/recording';

export const ALL_RECORDINGS_VIEW_ID = '264b131d-2c52-5a8b-bdfe-2221e62d2123';

export default defineView({
  universalIdentifier: ALL_RECORDINGS_VIEW_ID,
  name: 'All Recordings',
  objectUniversalIdentifier: RECORDING_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  key: ViewKey.INDEX,
  icon: 'IconVideo',
  position: 0,
  fields: [
    { universalIdentifier: '3adb270f-88f4-5d70-b41a-3bac6f45ee9b', fieldMetadataUniversalIdentifier: NAME_FIELD_ID, position: 0, isVisible: true, size: 200 },
    { universalIdentifier: '58c8d9ff-2bc1-59ed-91c3-786a8ca1ccf7', fieldMetadataUniversalIdentifier: DATE_FIELD_ID, position: 1, isVisible: true, size: 150 },
    { universalIdentifier: '39c719be-fc9f-51ed-8735-fae5381cb8ca', fieldMetadataUniversalIdentifier: DURATION_FIELD_ID, position: 2, isVisible: true, size: 100 },
    { universalIdentifier: 'dc6cb2b6-d887-5243-ab51-495ac36bde0b', fieldMetadataUniversalIdentifier: PLATFORM_FIELD_ID, position: 3, isVisible: true, size: 130 },
    { universalIdentifier: 'f8605012-003f-5460-8c3e-d5685a24b97a', fieldMetadataUniversalIdentifier: STATUS_FIELD_ID, position: 4, isVisible: true, size: 110 },
    { universalIdentifier: 'ab2dce09-bbb9-5f64-af5f-48da59dd7a53', fieldMetadataUniversalIdentifier: MEETING_URL_FIELD_ID, position: 5, isVisible: true, size: 140 },
    { universalIdentifier: '3cd5d593-2f93-5a62-9de9-f70c1458a476', fieldMetadataUniversalIdentifier: MP4_URL_FIELD_ID, position: 6, isVisible: true, size: 140 },
  ],
});
