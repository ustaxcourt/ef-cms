import '@web-api/persistence/postgres/trialSessions/mocks.jest';
import { getPublicTrialSessionDetailsInteractor } from '@web-api/business/useCases/trialSessions/getPublicTrialSessionDetailsInteractor';
import { PublicCaseDTO } from '@shared/business/dto/cases/PublicCaseDTO';
import type { RawPublicTrialSessionDetails } from '@shared/business/entities/trialSessions/PublicTrialSessionDetails';
import { NotFoundError } from '@web-api/errors/errors';
import {
  SESSION_STATUS_TYPES,
  SESSION_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { CaseFactory } from '@web-api/business/entities/cases/CaseFactory';
import { getTrialSessionById as getTrialSessionByIdMock } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';
import { getCalendaredCasesForTrialSession as getCalendaredCasesForTrialSessionMock } from '@web-api/persistence/postgres/trialSessions/getCalendaredCasesForTrialSession';
import { MOCK_TRIAL_REGULAR } from '@shared/test/mockTrial';
import { MOCK_DOCUMENTS } from '@shared/test/mockDocketEntry';
import { MOCK_CASE } from '@shared/test/mockCase';

describe('getPublicTrialSessionDetailsInteractor', () => {
  const getTrialSessionById = jest.mocked(getTrialSessionByIdMock);
  const getCalendaredCasesForTrialSession = jest.mocked(
    getCalendaredCasesForTrialSessionMock,
  );

  const MOCK_TRIAL = {
    ...MOCK_TRIAL_REGULAR,
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

  beforeAll(() => {
    getTrialSessionById.mockResolvedValue(MOCK_TRIAL);

    getCalendaredCasesForTrialSession.mockResolvedValue([]);
  });

  it('should get the relevant session details for public users', async () => {
    const expectedPublicDetails: RawPublicTrialSessionDetails = {
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

  it('should throw when the trial session cannot be found', async () => {
    getTrialSessionById.mockResolvedValueOnce(undefined);

    await expect(
      getPublicTrialSessionDetailsInteractor({
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it('should include swing session location, exclude removed cases, and use the CaseFactory to return a formatted case DTO', async () => {
    const trialWithSwingSession = {
      ...MOCK_TRIAL,
      swingSessionId: '46f14ebf-00c7-4e14-b6a1-baf32ed09f12',
    };

    const swingTrialSession = {
      ...MOCK_TRIAL,
      trialLocation: 'Helena, Montana',
    };

    getTrialSessionById
      .mockResolvedValueOnce(trialWithSwingSession)
      .mockResolvedValueOnce(swingTrialSession);

    getCalendaredCasesForTrialSession.mockResolvedValueOnce([
      {
        ...MOCK_CASE,
        docketEntries: [MOCK_DOCUMENTS[0]],
        addedToSessionAt: '2018-03-01T21:40:46.415Z',
        isHearing: false,
        isManuallyAdded: false,
        removedFromTrial: false,
      },
      {
        ...MOCK_CASE,
        docketEntries: [MOCK_DOCUMENTS[1]],
        addedToSessionAt: '2018-03-01T21:40:46.415Z',
        isHearing: false,
        isManuallyAdded: false,
        removedFromTrial: true,
      },
    ]);

    const getCaseDTOSpy = jest
      .spyOn(CaseFactory, 'getCaseDTO')
      .mockReturnValue({} as PublicCaseDTO);

    const result = await getPublicTrialSessionDetailsInteractor({
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(result.swingSessionLocation).toEqual('Helena, Montana');
    expect(result.calendaredCases).toEqual([{}]);
    expect(getCaseDTOSpy).toHaveBeenCalledTimes(1);
    expect(getCaseDTOSpy).toHaveBeenCalledWith({
      rawCase: expect.objectContaining({
        docketEntries: [],
        removedFromTrial: false,
      }),
      user: undefined,
    });
  });
});
