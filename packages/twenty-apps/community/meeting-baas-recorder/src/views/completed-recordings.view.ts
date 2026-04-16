import { defineView } from 'twenty-sdk';
import { ViewType, ViewFilterOperand } from 'twenty-shared/types';
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

export default defineView({
  universalIdentifier: '394e8d23-555f-5bf7-9b4e-367b6dbf38b0',
  name: 'Completed Recordings',
  objectUniversalIdentifier: RECORDING_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconCheck',
  position: 1,
  fields: [
    { universalIdentifier: '0028769e-bca1-596c-aafe-fc5531db661a', fieldMetadataUniversalIdentifier: NAME_FIELD_ID, position: 0, isVisible: true, size: 200 },
    { universalIdentifier: '1fa50163-249f-5803-bbce-541ed672feea', fieldMetadataUniversalIdentifier: DATE_FIELD_ID, position: 1, isVisible: true, size: 150 },
    { universalIdentifier: 'f9905717-131e-59df-99a9-44f33a2beded', fieldMetadataUniversalIdentifier: DURATION_FIELD_ID, position: 2, isVisible: true, size: 100 },
    { universalIdentifier: 'bdacee9b-9cb3-5948-9421-6908309c21b9', fieldMetadataUniversalIdentifier: PLATFORM_FIELD_ID, position: 3, isVisible: true, size: 130 },
    { universalIdentifier: '62292205-0c46-55b9-be01-f15297b66d87', fieldMetadataUniversalIdentifier: STATUS_FIELD_ID, position: 4, isVisible: true, size: 110 },
    { universalIdentifier: 'b9814d60-e66b-57c2-a67b-3ecd4eddbc43', fieldMetadataUniversalIdentifier: MEETING_URL_FIELD_ID, position: 5, isVisible: true, size: 140 },
    { universalIdentifier: '67643943-04f2-5b7c-9592-0d69824a3967', fieldMetadataUniversalIdentifier: MP4_URL_FIELD_ID, position: 6, isVisible: true, size: 140 },
  ],
  filters: [
    {
      universalIdentifier: '1f9a7d8e-19d2-5d39-8783-65529e0048fa',
      fieldMetadataUniversalIdentifier: STATUS_FIELD_ID,
      operand: ViewFilterOperand.IS,
      value: 'COMPLETED',
    },
  ],
});
