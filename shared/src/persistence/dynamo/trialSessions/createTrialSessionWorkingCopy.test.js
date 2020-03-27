const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  createTrialSessionWorkingCopy,
} = require('./createTrialSessionWorkingCopy');

const mockTrialSessionWorkingCopy = {
  trialSessionId: '456',
  userId: '123',
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
        sk: 'user|123',
        trialSessionId: '456',
        userId: '123',
      },
      TableName: 'efcms-dev',
    });
  });
});
