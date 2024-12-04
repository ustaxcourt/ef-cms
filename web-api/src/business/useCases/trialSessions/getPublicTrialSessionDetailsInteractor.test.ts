import {
  PublicTrialSessionDetails,
  getPublicTrialSessionDetailsInteractor,
} from '@web-api/business/useCases/trialSessions/getPublicTrialSessionDetailsInteractor';
import {
  SESSION_STATUS_TYPES,
  SESSION_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';

describe('getEligibleCasesForTrialSessionInteractor', () => {
  let mockTrial;

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

    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockImplementation(() => mockTrial);

    applicationContext
      .getPersistenceGateway()
      .getCalendaredCasesForTrialSession.mockImplementation(() => []);
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

    const result = await getPublicTrialSessionDetailsInteractor(
      applicationContext,
      {
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      },
    );
    expect(result).toMatchObject(expectedPublicDetails);
  });
});
