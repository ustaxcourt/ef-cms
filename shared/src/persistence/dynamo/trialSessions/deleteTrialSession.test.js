const { deleteTrialSession } = require('./deleteTrialSession');

describe('deleteTrialSession', () => {
  let applicationContext;
  let deleteStub;

  const trialSessionId = '123';

  beforeEach(() => {
    deleteStub = jest.fn().mockReturnValue({
      promise: async () => null,
    });

    applicationContext = {
      environment: {
        stage: 'dev',
      },
      getDocumentClient: () => ({
        delete: deleteStub,
      }),
    };
  });

  it('attempts to remove the trial session', async () => {
    await deleteTrialSession({
      applicationContext,
      trialSessionId,
    });

    expect(deleteStub.mock.calls[0][0]).toMatchObject({
      Key: {
        pk: `trial-session|${trialSessionId}`,
        sk: `trial-session|${trialSessionId}`,
      },
      TableName: 'efcms-dev',
    });
  });
});
