import '@web-api/persistence/postgres/cases/mocks.jest';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import {
  PROCEDURE_TYPES_MAP,
  SESSION_TERMS_DICT,
  SESSION_TYPES,
} from '@shared/business/entities/EntityConstants';
import { UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getTrialSessionPlanningReportDataInteractor } from '@web-api/business/useCases/trialSessions/getTrialSessionPlanningReportDataInteractor';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { getBlockedCasesCount as getBlockedCasesCountMock } from '@web-api/persistence/postgres/cases/reports/getBlockedCasesCount';
import { getEligibleCasesCount as getEligibleCasesCountMock } from '@web-api/persistence/postgres/cases/getEligibleCasesCount';

const getBlockedCasesCount = jest.mocked(getBlockedCasesCountMock);
const getEligibleCasesCount = jest.mocked(getEligibleCasesCountMock);

describe('getTrialSessionPlanningReportDataInteractor', () => {
  const ALL_TRIAL_SESSIONS_MOCK: RawTrialSession[] = [
    {
      isCalendared: true,
      judge: {
        name: 'TEST_JUDGE_4',
        userId: 'TEST_JUDGE_ID',
      },
      sessionType: 'Hybrid',
      startDate: '2099-03-01T00:00:00.000Z',
      term: SESSION_TERMS_DICT.WINTER,
      termYear: '2023',
      trialLocation: 'Denver, Colorado',
    } as RawTrialSession,
    {
      isCalendared: true,
      judge: {
        name: 'TEST_JUDGE_3',
        userId: 'TEST_JUDGE_ID',
      },
      sessionType: SESSION_TYPES.hybridSmall,
      startDate: '2098-03-01T00:00:00.000Z',
      term: SESSION_TERMS_DICT.WINTER,
      termYear: '2023',
      trialLocation: 'Denver, Colorado',
    } as RawTrialSession,
    {
      isCalendared: true,
      judge: {
        name: 'TEST_JUDGE_2',
        userId: 'TEST_JUDGE_ID',
      },
      sessionType: 'Hybrid',
      startDate: '2099-03-01T00:00:00.000Z',
      term: SESSION_TERMS_DICT.SPRING,
      termYear: '2023',
      trialLocation: 'Denver, Colorado',
    } as RawTrialSession,
    {
      isCalendared: true,
      judge: {
        name: 'TEST_JUDGE_1',
        userId: 'TEST_JUDGE_ID',
      },
      sessionType: 'Hybrid',
      startDate: '2099-03-01T00:00:00.000Z',
      term: SESSION_TERMS_DICT.FALL,
      termYear: '2023',
      trialLocation: 'Denver, Colorado',
    } as RawTrialSession,
    {
      isCalendared: true,
      sessionType: 'Special',
      startDate: '2024-03-01T00:00:00.000Z',
      term: SESSION_TERMS_DICT.WINTER,
      termYear: '2024',
      trialLocation: 'Denver, Colorado',
    } as RawTrialSession,
    {
      isCalendared: true,
      sessionType: 'Hybrid',
      startDate: '2024-03-01T00:00:00.000Z',
      term: SESSION_TERMS_DICT.WINTER,
      termYear: '2024',
      trialLocation: 'Denver, Colorado',
    } as RawTrialSession,
    {
      isCalendared: false,
      sessionType: 'Special',
      startDate: '2024-03-01T00:00:00.000Z',
      term: SESSION_TERMS_DICT.WINTER,
      termYear: '2024',
      trialLocation: 'Denver, Colorado',
    } as RawTrialSession,
    {
      isCalendared: true,
      sessionType: 'Special',
      startDate: '1998-03-01T00:00:00.000Z',
      term: SESSION_TERMS_DICT.WINTER,
      termYear: '2024',
      trialLocation: 'Fresno, California',
    } as RawTrialSession,
    {
      isCalendared: true,
      sessionType: 'Special',
      startDate: '1999-03-01T00:00:00.000Z',
      term: SESSION_TERMS_DICT.WINTER,
      termYear: '2024',
      trialLocation: 'Fresno, California',
    } as RawTrialSession,
    {
      isCalendared: true,
      sessionType: 'Special',
      startDate: '1997-03-01T00:00:00.000Z',
      term: SESSION_TERMS_DICT.WINTER,
      termYear: '2024',
    } as RawTrialSession,
    {
      isCalendared: true,
      sessionType: 'Special',
      startDate: '2024-03-01T00:00:00.000Z',
      term: SESSION_TERMS_DICT.WINTER,
      termYear: '2024',
      trialLocation: 'Denver, Colorado',
    } as RawTrialSession,
    {
      isCalendared: true,
      sessionType: 'Hybrid',
      startDate: '2019-03-01T00:00:00.000Z',
      term: SESSION_TERMS_DICT.WINTER,
      termYear: '2024',
      trialLocation: 'Denver, Colorado',
    } as RawTrialSession,
  ];

  const BLOCKED_CASES_COUNT_MOCK = 3;
  const REGULAR_ELIGIBLE_CASES_COUNT = 2;
  const SMALL_ELIGIBLE_CASES_COUNT = 1;

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessions.mockResolvedValue(ALL_TRIAL_SESSIONS_MOCK);

    getEligibleCasesCount.mockImplementation(({ procedureType }) => {
      if (procedureType === PROCEDURE_TYPES_MAP.regular) {
        return Promise.resolve(REGULAR_ELIGIBLE_CASES_COUNT);
      } else {
        return Promise.resolve(SMALL_ELIGIBLE_CASES_COUNT);
      }
    });

    getBlockedCasesCount.mockResolvedValue(BLOCKED_CASES_COUNT_MOCK);
  });

  it('should throw error if the user is "Unauthorized"', async () => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue({});

    await expect(
      getTrialSessionPlanningReportDataInteractor(
        applicationContext,
        {
          term: 'WINTER',
          year: '2024',
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should return the correct Trial Session Planning Data for the correct term', async () => {
    const { previousTerms, trialLocationData } =
      await getTrialSessionPlanningReportDataInteractor(
        applicationContext,
        {
          term: 'winter',
          year: '2024',
        },
        mockPetitionsClerkUser,
      );

    const DENVER_TRIAL_SESSION = trialLocationData.find(
      ts => ts.trialCityState === 'Denver, Colorado',
    );

    expect(DENVER_TRIAL_SESSION).toEqual({
      allCaseCount: 3,
      blockedCaseCount: 3,
      lastVisitedDate: '2099-03-01T00:00:00.000Z',
      previousTermsData: [
        ['(H) TEST_JUDGE_1'],
        ['(H) TEST_JUDGE_2'],
        ['(HS) TEST_JUDGE_3', '(H) TEST_JUDGE_4'],
      ],
      regularCaseCount: 2,
      smallCaseCount: 1,
      specialCaseCount: 2,
      stateAbbreviation: 'CO',
      trialCityState: 'Denver, Colorado',
    });

    expect(previousTerms).toEqual([
      { term: 'fall', termDisplay: 'Fall 2023', year: '2023' },
      { term: 'spring', termDisplay: 'Spring 2023', year: '2023' },
      { term: 'winter', termDisplay: 'Winter 2023', year: '2023' },
    ]);
  });

  it('should return the correct last visited date when there is no scheduled trial session in past 3 terms', async () => {
    const { trialLocationData } =
      await getTrialSessionPlanningReportDataInteractor(
        applicationContext,
        {
          term: 'winter',
          year: '2024',
        },
        mockPetitionsClerkUser,
      );

    const FRESNO_TRIAL_SESSION = trialLocationData.find(
      ts => ts.trialCityState === 'Fresno, California',
    );

    expect(FRESNO_TRIAL_SESSION).toMatchObject({
      lastVisitedDate: '1999-03-01T00:00:00.000Z',
      specialCaseCount: 2,
      trialCityState: 'Fresno, California',
    });
  });
});
