const sinon = require('sinon');
const {
  deleteTrialSessionWorkingCopy,
} = require('./deleteTrialSessionWorkingCopy');

describe('deleteTrialSessionWorkingCopy', () => {
  let applicationContext;
  let deleteStub;

  const trialSessionId = '456';
  const userId = '338';

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
    await deleteTrialSessionWorkingCopy({
      applicationContext,
      trialSessionId,
      userId,
    });

    expect(deleteStub.getCall(0).args[0]).toMatchObject({
      Key: {
        pk: `trial-session-working-copy|${trialSessionId}`,
        sk: `${userId}`,
      },
      TableName: 'efcms-dev',
    });
  });
});
