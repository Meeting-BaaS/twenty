import { defineApplication } from 'twenty-sdk';
import { DEFAULT_ROLE_ID } from './src/roles/default.role';

export default defineApplication({
  universalIdentifier: 'b7e3a1f2-8d4c-4e6a-9f2b-1c5d7e8a3b4f',
  displayName: 'Meeting BaaS Recorder',
  description: 'Record meetings via Meeting BaaS and sync recordings, transcripts, and participants into Twenty.',
  icon: 'IconVideo',
  defaultRoleUniversalIdentifier: DEFAULT_ROLE_ID,
  settingsCustomTabFrontComponentUniversalIdentifier: 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b',
  applicationVariables: {
    MEETING_BAAS_API_KEY: {
      universalIdentifier: 'c1d2e3f4-5a6b-7c8d-9e0f-a1b2c3d4e5f6',
      description: 'Meeting BaaS API key for authenticating requests and verifying webhooks',
      isSecret: true,
      value: '',
    },
  },
});
