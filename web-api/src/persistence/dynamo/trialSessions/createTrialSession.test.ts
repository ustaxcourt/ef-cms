import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { createTrialSession } from './createTrialSession';

const mockTrialSession = {
  trialSessionId: '123',
};

describe('createTrialSession', () => {
  it('attempts to persist the trial session', async () => {
    await createTrialSession({
      applicationContext,
      trialSession: mockTrialSession as any,
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        pk: 'trial-session|123',
        sk: 'trial-session|123',
        trialSessionId: '123',
      },
    });
  });
});
