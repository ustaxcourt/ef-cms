import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { createTrialSessionWorkingCopy } from './createTrialSessionWorkingCopy';

const userId = 'a66ac519-fd1a-44ac-8226-b4a53d348677';

const mockTrialSessionWorkingCopy = {
  trialSessionId: '456',
  userId,
};

describe('createTrialSessionWorkingCopy', () => {
  it('attempts to persist the trial session', async () => {
    await createTrialSessionWorkingCopy({
      applicationContext,
      trialSessionWorkingCopy: mockTrialSessionWorkingCopy as any,
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        pk: 'trial-session-working-copy|456',
        sk: `user|${userId}`,
        trialSessionId: '456',
        userId,
      },
    });
  });
});
