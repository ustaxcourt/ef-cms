import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { deleteTrialSessionWorkingCopy } from './deleteTrialSessionWorkingCopy';

const mockTrialSessionId = '456';
const mockUserId = '338';

describe('deleteTrialSessionWorkingCopy', () => {
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
    });
  });
});
