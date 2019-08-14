const sinon = require('sinon');
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
    await createTrialSessionWorkingCopy({
      applicationContext,
      trialSessionWorkingCopy,
    });
    expect(putStub.getCall(0).args[0]).toMatchObject({
      Item: {
        pk: 'trial-session-working-copy|456',
        sk: '123',
        trialSessionId: '456',
        userId: '123',
      },
      TableName: 'efcms-dev',
    });
  });
});
