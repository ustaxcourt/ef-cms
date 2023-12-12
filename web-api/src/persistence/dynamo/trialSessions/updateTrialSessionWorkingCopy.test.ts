import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { updateTrialSessionWorkingCopy } from './updateTrialSessionWorkingCopy';

describe('updateTrialSessionWorkingCopy', () => {
  beforeAll(() => {
    applicationContext.getDocumentClient().put.mockResolvedValue(null);
  });

  it('invokes the persistence layer with pk of trial-session-working-copy|{trialSessionId}, sk of {userId} and other expected params', async () => {
    await updateTrialSessionWorkingCopy({
      applicationContext,
      trialSessionWorkingCopyToUpdate: {
        sort: 'practitioner',
        sortOrder: 'desc',
        trialSessionId: '456',
        userId: '123',
      } as any,
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        pk: 'trial-session-working-copy|456',
        sk: 'user|123',
        sort: 'practitioner',
        sortOrder: 'desc',
        trialSessionId: '456',
        userId: '123',
      },
    });
  });
});
