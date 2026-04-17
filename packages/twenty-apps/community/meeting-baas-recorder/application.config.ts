import { defineApplication } from 'twenty-sdk';
import { DEFAULT_ROLE_ID } from './src/roles/default.role';

export default defineApplication({
  universalIdentifier: 'c522c3c7-cff8-5c08-8c87-d1481adbd4a9',
  displayName: 'Meeting BaaS Recorder',
  description: 'Record meetings via Meeting BaaS and sync recordings, transcripts, and participants into Twenty.',
  icon: 'IconVideo',
  defaultRoleUniversalIdentifier: DEFAULT_ROLE_ID,
  settingsCustomTabFrontComponentUniversalIdentifier:
    '7f2c17b4-2cd2-5447-b7d1-83ef12040837',
  applicationVariables: {
    MEETING_BAAS_API_KEY: {
      universalIdentifier: '32cd6297-bbd3-5beb-a0f6-1f5662590f66',
      description: 'Meeting BaaS API key for authenticating requests and verifying webhooks',
      isSecret: true,
      value: '',
    },
  },
});
