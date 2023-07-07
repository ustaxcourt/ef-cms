import { MOCK_TRIAL_REMOTE } from '../../../test/mockTrial';
import { UnauthorizedError } from '../../../errors/errors';
import { applicationContext } from '../../test/createTestApplicationContext';
import { getTrialSessionDetailsInteractor } from './getTrialSessionDetailsInteractor';
import { omit } from 'lodash';
import { petitionsClerkUser } from '../../../test/mockUsers';

describe('Get trial session details', () => {
  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(petitionsClerkUser);
  });

  it('throws error if user is unauthorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue({});

    await expect(
      getTrialSessionDetailsInteractor(applicationContext, {
        trialSessionId: MOCK_TRIAL_REMOTE.trialSessionId,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('throws an error if the entity returned from persistence is invalid', async () => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockResolvedValue(
        omit(MOCK_TRIAL_REMOTE, 'maxCases'),
      );

    await expect(
      getTrialSessionDetailsInteractor(applicationContext, {
        trialSessionId: MOCK_TRIAL_REMOTE.trialSessionId,
      }),
    ).rejects.toThrow('The TrialSession entity was invalid');
  });

  it('throws a not found error if persistence does not return any results', async () => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockResolvedValue(null);

    await expect(
      getTrialSessionDetailsInteractor(applicationContext, {
        trialSessionId: MOCK_TRIAL_REMOTE.trialSessionId,
      }),
    ).rejects.toThrow(
      `Trial session ${MOCK_TRIAL_REMOTE.trialSessionId} was not found.`,
    );
  });

  it('correctly returns data from persistence', async () => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockResolvedValue(MOCK_TRIAL_REMOTE);

    const result = await getTrialSessionDetailsInteractor(applicationContext, {
      trialSessionId: MOCK_TRIAL_REMOTE.trialSessionId,
    });
    expect(result).toMatchObject(MOCK_TRIAL_REMOTE);
  });
});
