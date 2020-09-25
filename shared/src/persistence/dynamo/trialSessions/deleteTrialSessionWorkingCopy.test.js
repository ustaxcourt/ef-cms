const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  deleteTrialSessionWorkingCopy,
} = require('./deleteTrialSessionWorkingCopy');

const mockTrialSessionId = '456';
const mockUserId = '338';

describe('deleteTrialSessionWorkingCopy', () => {
  beforeAll(() => {
    applicationContext.environment.stage = 'dev';
  });

  it('attempts to remove the trial session', async () => {
    await deleteTrialSessionWorkingCopy({
      applicationContext,
      trialSessionId: mockTrialSessionId,
      userId: mockUserId,
    });

    expect(
      applicationContext.getDocumentClient().delete.mock.calls[0][0],
    ).toMatchObject({
      Key: {
        pk: `trial-session-working-copy|${mockTrialSessionId}`,
        sk: `user|${mockUserId}`,
      },
      TableName: 'efcms-dev',
    });
  });
});
