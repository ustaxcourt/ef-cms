const sinon = require('sinon');
const {
  updateTrialSessionWorkingCopy,
} = require('./updateTrialSessionWorkingCopy');

describe('updateTrialSessionWorkingCopy', () => {
  let putStub;
  beforeEach(() => {
    putStub = sinon.stub().returns({
      promise: async () => null,
    });
  });

  it('invokes the persistence layer with pk of trial-session-working-copy|{trialSessionId}, sk of {userId} and other expected params', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
      getDocumentClient: () => ({
        put: putStub,
      }),
    };
    await updateTrialSessionWorkingCopy({
      applicationContext,
      trialSessionWorkingCopyToUpdate: {
        sort: 'practitioner',
        sortOrder: 'desc',
        trialSessionId: '456',
        userId: '123',
      },
    });
    expect(putStub.getCall(0).args[0]).toMatchObject({
      Item: {
        pk: 'trial-session-working-copy|456',
        sk: '123',
        sort: 'practitioner',
        sortOrder: 'desc',
        trialSessionId: '456',
        userId: '123',
      },
      applicationContext: { environment: { stage: 'dev' } },
    });
  });
});
