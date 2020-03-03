const sinon = require('sinon');
const { deleteTrialSession } = require('./deleteTrialSession');

describe('deleteTrialSession', () => {
  let applicationContext;
  let deleteStub;

  const trialSessionId = '123';

  beforeEach(() => {
    deleteStub = sinon.stub().returns({
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

    expect(deleteStub.getCall(0).args[0]).toMatchObject({
      Key: {
        pk: `trial-session-${trialSessionId}`,
        sk: `trial-session-${trialSessionId}`,
      },
      TableName: 'efcms-dev',
    });
  });
});
