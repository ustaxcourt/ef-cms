const sinon = require('sinon');
const { createTrialSession } = require('./createTrialSession');

describe('createTrialSession', () => {
  let applicationContext;
  let putStub;

  const trialSession = {
    trialSessionId: '123',
  };

  beforeEach(() => {
    putStub = sinon.stub().returns({
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
    expect(putStub.getCall(0).args[0]).toMatchObject({
      Item: {
        pk: 'trial-session-123',
        sk: 'trial-session-123',
        trialSessionId: '123',
      },
      TableName: 'efcms-dev',
    });
  });
});
