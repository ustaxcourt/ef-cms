import {
  ROLES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} from '../../entities/EntityConstants';
import { UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '../../test/createTestApplicationContext';
import { getTrialSessionDetailsInteractor } from './getTrialSessionDetailsInteractor';
import { omit } from 'lodash';

describe('Get trial session details', () => {
  const MOCK_TRIAL_SESSION = {
    maxCases: 100,
    proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
    sessionType: 'Regular',
    startDate: '3000-03-01T00:00:00.000Z',
    term: 'Fall',
    termYear: '3000',
    trialLocation: 'Birmingham, Alabama',
    trialSessionId: '208a959f-9526-4db5-b262-e58c476a4604',
  };

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    });
  });

  it('throws error if user is unauthorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue({});

    await expect(
      getTrialSessionDetailsInteractor(applicationContext, {
        trialSessionId: MOCK_TRIAL_SESSION.trialSessionId,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('throws an error if the entity returned from persistence is invalid', async () => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockResolvedValue(
        omit(MOCK_TRIAL_SESSION, 'maxCases'),
      );

    await expect(
      getTrialSessionDetailsInteractor(applicationContext, {
        trialSessionId: MOCK_TRIAL_SESSION.trialSessionId,
      }),
    ).rejects.toThrow('The TrialSession entity was invalid');
  });

  it('throws a not found error if persistence does not return any results', async () => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockResolvedValue(null);

    await expect(
      getTrialSessionDetailsInteractor(applicationContext, {
        trialSessionId: MOCK_TRIAL_SESSION.trialSessionId,
      }),
    ).rejects.toThrow(
      'Trial session 208a959f-9526-4db5-b262-e58c476a4604 was not found.',
    );
  });

  it('correctly returns data from persistence', async () => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockResolvedValue(MOCK_TRIAL_SESSION);

    const result = await getTrialSessionDetailsInteractor(applicationContext, {
      trialSessionId: MOCK_TRIAL_SESSION.trialSessionId,
    });
    expect(result).toMatchObject(MOCK_TRIAL_SESSION);
  });
});
