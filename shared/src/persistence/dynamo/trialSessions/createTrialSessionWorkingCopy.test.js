const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  createTrialSessionWorkingCopy,
} = require('./createTrialSessionWorkingCopy');

const userId = 'a66ac519-fd1a-44ac-8226-b4a53d348677';

const mockTrialSessionWorkingCopy = {
  trialSessionId: '456',
  userId,
};

describe('createTrialSessionWorkingCopy', () => {
  beforeAll(() => {
    applicationContext.environment.stage = 'dev';
  });

  it('attempts to persist the trial session', async () => {
    await createTrialSessionWorkingCopy({
      applicationContext,
      trialSessionWorkingCopy: mockTrialSessionWorkingCopy,
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        pk: 'trial-session-working-copy|456',
        sk: `user|${userId}`,
        trialSessionId: '456',
        userId,
      },
      TableName: 'efcms-dev',
    });
  });
});
