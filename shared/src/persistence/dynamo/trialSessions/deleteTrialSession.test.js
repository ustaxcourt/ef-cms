const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { deleteTrialSession } = require('./deleteTrialSession');

const mockTrialSessionId = '123';

describe('deleteTrialSession', () => {
  beforeAll(() => {
    applicationContext.environment.stage = 'dev';
  });

  it('attempts to remove the trial session', async () => {
    await deleteTrialSession({
      applicationContext,
      trialSessionId: mockTrialSessionId,
    });

    expect(
      applicationContext.getDocumentClient().delete.mock.calls[0][0],
    ).toMatchObject({
      Key: {
        pk: `trial-session|${mockTrialSessionId}`,
        sk: `trial-session|${mockTrialSessionId}`,
      },
      TableName: 'efcms-dev',
    });
  });
});
