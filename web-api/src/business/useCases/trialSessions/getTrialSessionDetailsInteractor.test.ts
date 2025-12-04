import '@web-api/persistence/postgres/trialSessions/mocks.jest';
import {
  SESSION_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { UnauthorizedError } from '@web-api/errors/errors';
import { getTrialSessionDetailsInteractor } from './getTrialSessionDetailsInteractor';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { omit } from 'lodash';
import { getTrialSessionById as getTrialSessionByIdMock } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';

describe('Get trial session details', () => {
  const getTrialSessionById = jest.mocked(getTrialSessionByIdMock);

  const MOCK_TRIAL_SESSION: Partial<RawTrialSession> = {
    maxCases: 100,
    proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
    sessionType: SESSION_TYPES.regular,
    startDate: '3000-03-01T00:00:00.000Z',
    term: 'Fall',
    termYear: '3000',
    trialLocation: 'Birmingham, Alabama',
    trialSessionId: '208a959f-9526-4db5-b262-e58c476a4604',
  };

  it('throws error if user is unauthorized', async () => {
    getTrialSessionById.mockResolvedValue(undefined);

    await expect(
      getTrialSessionDetailsInteractor(
        {
          trialSessionId: MOCK_TRIAL_SESSION.trialSessionId!,
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('throws an error if the entity returned from persistence is invalid', async () => {
    getTrialSessionById.mockResolvedValue(
      // @ts-expect-error - Intentionally testing with incomplete mock data missing maxCases field
      omit(MOCK_TRIAL_SESSION, 'maxCases'),
    );

    await expect(
      getTrialSessionDetailsInteractor(
        {
          trialSessionId: MOCK_TRIAL_SESSION.trialSessionId!,
        },
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow('The TrialSession entity was invalid');
  });

  it('throws a not found error if persistence does not return any results', async () => {
    getTrialSessionById.mockResolvedValue(undefined);

    await expect(
      getTrialSessionDetailsInteractor(
        {
          trialSessionId: MOCK_TRIAL_SESSION.trialSessionId!,
        },
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow(
      'Trial session 208a959f-9526-4db5-b262-e58c476a4604 was not found.',
    );
  });

  it('correctly returns data from persistence', async () => {
    getTrialSessionById.mockResolvedValue(
      MOCK_TRIAL_SESSION as RawTrialSession,
    );

    const result = await getTrialSessionDetailsInteractor(
      {
        trialSessionId: MOCK_TRIAL_SESSION.trialSessionId!,
      },
      mockPetitionsClerkUser,
    );
    expect(result).toMatchObject(MOCK_TRIAL_SESSION);
  });
});
