import { defineRole, PermissionFlag } from 'twenty-sdk';
import { RECORDING_UNIVERSAL_IDENTIFIER } from '../objects/recording';

export const DEFAULT_ROLE_ID = '5aceb3d4-2453-58e8-a19f-e3ae7e148e93';

export default defineRole({
  universalIdentifier: DEFAULT_ROLE_ID,
  label: 'Meeting BaaS Recorder role',
  description: 'Default role for the Meeting BaaS Recorder app',
  canReadAllObjectRecords: false,
  canUpdateAllObjectRecords: false,
  canSoftDeleteAllObjectRecords: false,
  canDestroyAllObjectRecords: false,
  canUpdateAllSettings: false,
  canBeAssignedToAgents: false,
  canBeAssignedToUsers: false,
  canBeAssignedToApiKeys: false,
  objectPermissions: [
    {
      objectUniversalIdentifier: RECORDING_UNIVERSAL_IDENTIFIER,
      canReadObjectRecords: true,
      canUpdateObjectRecords: true,
      canSoftDeleteObjectRecords: true,
      canDestroyObjectRecords: false,
    },
  ],
  permissionFlags: [PermissionFlag.APPLICATIONS],
});
