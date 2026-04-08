// Global test setup for Meeting BaaS Recorder

global.fetch = jest.fn();

process.env.MEETING_BAAS_API_KEY = 'test-meeting-baas-api-key';
process.env.TWENTY_API_KEY = 'test-twenty-api-key';
process.env.SERVER_URL = 'http://localhost:3000';
process.env.LOG_LEVEL = 'silent';
process.env.NODE_ENV = 'test';

beforeEach(() => {
  jest.clearAllMocks();
});
