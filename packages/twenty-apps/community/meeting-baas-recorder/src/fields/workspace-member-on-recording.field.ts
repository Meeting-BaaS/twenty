import {
  defineField,
  FieldType,
  RelationType,
  OnDeleteAction,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk';
import { RECORDING_UNIVERSAL_IDENTIFIER } from '../objects/recording';

export const WORKSPACE_MEMBER_ON_RECORDING_ID = '8e985272-eae7-51ac-939b-5277b1107bc8';
export const RECORDINGS_ON_WORKSPACE_MEMBER_ID = '8ab15013-866c-51d5-95bb-21108a07442f';

export default defineField({
  universalIdentifier: WORKSPACE_MEMBER_ON_RECORDING_ID,
  objectUniversalIdentifier: RECORDING_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'workspaceMember',
  label: 'Owner',
  icon: 'IconUser',
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier: RECORDINGS_ON_WORKSPACE_MEMBER_ID,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'workspaceMemberId',
  },
});
