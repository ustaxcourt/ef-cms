const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  updateTrialSessionWorkingCopy,
} = require('./updateTrialSessionWorkingCopy');

describe('updateTrialSessionWorkingCopy', () => {
  let putStub;
  beforeEach(() => {
    putStub = jest.fn().mockReturnValue({
      promise: async () => null,
    });
  });

  it('invokes the persistence layer with pk of trial-session-working-copy|{trialSessionId}, sk of {userId} and other expected params', async () => {
    applicationContext.getDocumentClient.mockReturnValue({
      put: putStub,
    });

    await updateTrialSessionWorkingCopy({
      applicationContext,
      trialSessionWorkingCopyToUpdate: {
        sort: 'practitioner',
        sortOrder: 'desc',
        trialSessionId: '456',
        userId: '123',
      },
    });
    expect(putStub.mock.calls[0][0]).toMatchObject({
      Item: {
        pk: 'trial-session-working-copy|456',
        sk: 'user|123',
        sort: 'practitioner',
        sortOrder: 'desc',
        trialSessionId: '456',
        userId: '123',
      },
      applicationContext: { environment: { stage: 'local' } },
    });
  });
});
