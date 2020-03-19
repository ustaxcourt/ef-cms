const {
  createTrialSessionWorkingCopy,
} = require('./createTrialSessionWorkingCopy');

describe('createTrialSessionWorkingCopy', () => {
  let applicationContext;
  let putStub;

  const trialSessionWorkingCopy = {
    trialSessionId: '456',
    userId: '123',
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
    await createTrialSessionWorkingCopy({
      applicationContext,
      trialSessionWorkingCopy,
    });
    expect(putStub.mock.calls[0][0]).toMatchObject({
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
