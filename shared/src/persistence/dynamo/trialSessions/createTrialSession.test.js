const { createTrialSession } = require('./createTrialSession');

describe('createTrialSession', () => {
  let applicationContext;
  let putStub;

  const trialSession = {
    trialSessionId: '123',
  };

  beforeEach(() => {
    putStub = jest.fn().mockReturnValue({
      promise: async () => null,
    });

    applicationContext = {
      environment: {
        stage: 'dev',
      },
      getDocumentClient: () => ({
        put: putStub,
      }),
    };
  });

  it('attempts to persist the trial session', async () => {
    await createTrialSession({
      applicationContext,
      trialSession,
    });
    expect(putStub.mock.calls[0][0]).toMatchObject({
      Item: {
        pk: 'trial-session|123',
        sk: 'trial-session|123',
        trialSessionId: '123',
      },
      TableName: 'efcms-dev',
    });
  });
});
