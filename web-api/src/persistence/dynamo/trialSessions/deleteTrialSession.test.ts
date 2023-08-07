import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { deleteTrialSession } from './deleteTrialSession';

const mockTrialSessionId = '123';

describe('deleteTrialSession', () => {
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
    });
  });
});
