import '@web-api/persistence/postgres/trialSessions/mocks.jest';
import {
  PublicTrialSessionDetails,
  getPublicTrialSessionDetailsInteractor,
} from '@web-api/business/useCases/trialSessions/getPublicTrialSessionDetailsInteractor';
import {
  SESSION_STATUS_TYPES,
  SESSION_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { getTrialSessionById as getTrialSessionByIdMock } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';
import { getCalendaredCasesForTrialSession as getCalendaredCasesForTrialSessionMock } from '@web-api/persistence/postgres/trialSessions/getCalendaredCasesForTrialSession';

describe('getEligibleCasesForTrialSessionInteractor', () => {
  let mockTrial;

  const getTrialSessionById = jest.mocked(getTrialSessionByIdMock);
  const getCalendaredCasesForTrialSession = jest.mocked(
    getCalendaredCasesForTrialSessionMock,
  );

  const MOCK_TRIAL = {
    address1: '123 E Underwater',
    address2: 'P.O. Box 2',
    city: 'Atlantis',
    courthouseName: 'a courthouse',
    maxCases: 100,
    postalCode: '11111',
    proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
    sessionStatus: SESSION_STATUS_TYPES.open,
    sessionType: SESSION_TYPES.regular,
    startDate: '2025-12-01T00:00:00.000Z',
    state: 'AL',
    swingSessionId: undefined,
    term: 'Fall',
    termYear: '2025',
    trialLocation: 'Birmingham, Alabama',
  };

  beforeEach(() => {
    mockTrial = MOCK_TRIAL;

    getTrialSessionById.mockResolvedValue(mockTrial);

    getCalendaredCasesForTrialSession.mockResolvedValue([]);
  });

  it('should get the relevant session details for public users', async () => {
    const expectedPublicDetails: PublicTrialSessionDetails = {
      address1: '123 E Underwater',
      address2: 'P.O. Box 2',
      calendaredCases: [],
      city: 'Atlantis',
      courthouseName: 'a courthouse',
      postalCode: '11111',
      startDate: '2025-12-01T00:00:00.000Z',
      state: 'AL',
      swingSessionId: undefined,
      trialLocation: 'Birmingham, Alabama',
    };

    const result = await getPublicTrialSessionDetailsInteractor({
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });
    expect(result).toMatchObject(expectedPublicDetails);
  });

  it('should throw a NotFoundError when the trial session is not found', async () => {
    getTrialSessionById.mockResolvedValue(undefined as any);

    await expect(
      getPublicTrialSessionDetailsInteractor({
        trialSessionId: 'nonexistent-id',
      }),
    ).rejects.toThrow('was not found');
  });

  it('should look up swing session location when the session has a swingSessionId', async () => {
    const swingSessionId = '1234abcd-18d0-43ec-bafb-654e83405416';
    getTrialSessionById
      .mockResolvedValueOnce({
        ...MOCK_TRIAL,
        swingSessionId,
      })
      .mockResolvedValueOnce({
        ...MOCK_TRIAL,
        trialLocation: 'Houston, Texas',
      });

    const result = await getPublicTrialSessionDetailsInteractor({
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(result.swingSessionId).toEqual(swingSessionId);
    expect(result.swingSessionLocation).toEqual('Houston, Texas');
  });
});
