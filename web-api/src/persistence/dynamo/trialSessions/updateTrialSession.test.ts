import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { updateTrialSession } from './updateTrialSession';

describe('updateTrialSession', () => {
  beforeAll(() => {
    applicationContext.getDocumentClient().put.mockReturnValue({
      promise: () => Promise.resolve(null),
    });
  });

  it('invokes the persistence layer with pk of trial-session|{trialSessionId}, sk of trial-session|{trialSessionId} and other expected params', async () => {
    await updateTrialSession({
      applicationContext,
      trialSessionToUpdate: {
        trialLocation: 'VEGAS BABY',
        trialSessionId: '123',
      } as any,
    });
    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        pk: 'trial-session|123',
        sk: 'trial-session|123',
        trialLocation: 'VEGAS BABY',
        trialSessionId: '123',
      },
    });
  });
});
