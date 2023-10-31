import { MOCK_TRIAL_INPERSON } from '@shared/test/mockTrial';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { omit } from 'lodash';
import { updateTrialSession } from './updateTrialSession';

describe('updateTrialSession', () => {
  beforeAll(() => {
    applicationContext.getDocumentClient().batchWrite.mockReturnValue({
      promise: () => Promise.resolve(null),
    });
  });

  it('invokes the persistence layer with pk of trial-session|{trialSessionId}, sk of trial-session|{trialSessionId} and other expected params', async () => {
    const trialSessionToUpdate = MOCK_TRIAL_INPERSON;

    await updateTrialSession({
      applicationContext,
      trialSessionToUpdate,
    });

    expect(
      applicationContext.getDocumentClient().batchWrite.mock.calls[0][0],
    ).toEqual({
      RequestItems: {
        ['efcms-local']: [
          {
            PutRequest: {
              Item: {
                gsi1pk: 'trial-session-catalog',
                pk: `trial-session|${MOCK_TRIAL_INPERSON.trialSessionId}`,
                sk: `trial-session|${MOCK_TRIAL_INPERSON.trialSessionId}`,
                ...omit(trialSessionToUpdate, 'paperServicePdfs'),
              },
            },
          },
        ],
      },
    });
  });
});
