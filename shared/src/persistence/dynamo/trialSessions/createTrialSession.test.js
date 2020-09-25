const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { createTrialSession } = require('./createTrialSession');

const mockTrialSession = {
  trialSessionId: '123',
};

describe('createTrialSession', () => {
  beforeAll(() => {
    applicationContext.environment.stage = 'dev';
  });

  it('attempts to persist the trial session', async () => {
    await createTrialSession({
      applicationContext,
      trialSession: mockTrialSession,
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        pk: 'trial-session|123',
        sk: 'trial-session|123',
        trialSessionId: '123',
      },
      TableName: 'efcms-dev',
    });
  });
});
