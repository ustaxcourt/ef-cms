import { mockFactory } from '@shared/test/mockFactory';

jest.mock('@web-api/persistence/postgres/cases/createCase', () =>
  mockFactory('createCase'),
);

jest.mock('@web-api/persistence/postgres/cases/generateDocketNumber', () =>
  mockFactory('generateDocketNumber'),
);

jest.mock('@web-api/persistence/postgres/cases/getCaseByDocketNumber', () =>
  mockFactory('getCaseByDocketNumber'),
);

jest.mock(
  '@web-api/persistence/postgres/cases/getCaseMetadataByDocketNumber',
  () => mockFactory('getCaseMetadataByDocketNumber'),
);

jest.mock(
  '@web-api/persistence/postgres/cases/getCaseMetadataWithCounsel',
  () => mockFactory('getCaseMetadataWithCounsel'),
);

jest.mock(
  '@web-api/persistence/postgres/cases/getCasesByLeadDocketNumber',
  () => mockFactory('getCasesByLeadDocketNumber'),
);

jest.mock(
  '@web-api/persistence/postgres/cases/getCasesMetadataByDocketNumbers',
  () => mockFactory('getCasesMetadataByDocketNumbers'),
);

jest.mock(
  '@web-api/persistence/postgres/cases/getCasesMetadataWithCounselByLeadDocketNumber',
  () => mockFactory('getCasesMetadataWithCounselByLeadDocketNumber'),
);

jest.mock('@web-api/persistence/postgres/cases/getConsolidatedCasesCount', () =>
  mockFactory('getConsolidatedCasesCount'),
);

jest.mock(
  '@web-api/persistence/postgres/cases/getCasesInConsolidatedGroup',
  () => mockFactory('getCasesInConsolidatedGroup'),
);

jest.mock('@web-api/persistence/postgres/cases/updateCase', () =>
  mockFactory('updateCase'),
);

jest.mock('@web-api/persistence/postgres/cases/upsertCases', () =>
  mockFactory('upsertCases'),
);

jest.mock(
  '@web-api/persistence/postgres/cases/reports/getReadyForTrialCases',
  () => mockFactory('getReadyForTrialCases'),
);

jest.mock(
  '@web-api/persistence/postgres/cases/getEligibleCasesForTrialCity',
  () => mockFactory('getEligibleCasesForTrialCity'),
);

jest.mock('@web-api/persistence/postgres/cases/getEligibleCasesCount', () =>
  mockFactory('getEligibleCasesCount'),
);

jest.mock(
  '@web-api/persistence/postgres/cases/reports/getBlockedCasesCount',
  () => mockFactory('getBlockedCasesCount'),
);

// Parties

jest.mock(
  '@web-api/persistence/postgres/cases/parties/createPetitionersOnCase',
  () => mockFactory('createPetitionersOnCase'),
);

jest.mock(
  '@web-api/persistence/postgres/cases/parties/deletePetitionerOnCase',
  () => mockFactory('deletePetitionerOnCase'),
);

jest.mock(
  '@web-api/persistence/postgres/cases/parties/updatePetitionerOnCase',
  () => mockFactory('updatePetitionerOnCase'),
);

jest.mock(
  '@web-api/persistence/postgres/cases/parties/upsertPetitionersOnCase',
  () => mockFactory('upsertPetitionersOnCase'),
);

jest.mock(
  '@web-api/persistence/postgres/cases/parties/getPetitionersOnCase',
  () => mockFactory('getPetitionersOnCase'),
);

// Reports

jest.mock('@web-api/persistence/postgres/cases/reports/fetchPendingItems', () =>
  mockFactory('fetchPendingItems'),
);

jest.mock(
  '@web-api/persistence/postgres/cases/reports/getBlockedCasesForTrialLocation',
  () => mockFactory('getBlockedCasesForTrialLocation'),
);

jest.mock(
  '@web-api/persistence/postgres/cases/reports/getCaseInventoryReport',
  () => mockFactory('getCaseInventoryReport', { foundCases: [], total: 0 }),
);

jest.mock(
  '@web-api/persistence/postgres/cases/reports/getCasesByEmailTotal',
  () => mockFactory('getCasesByEmailTotal'),
);

jest.mock('@web-api/persistence/postgres/cases/reports/getCasesByFilters', () =>
  mockFactory('getCasesByFilters'),
);

jest.mock(
  '@web-api/persistence/postgres/cases/reports/getCasesClosedCountByJudge',
  () => mockFactory('getCasesClosedCountByJudge'),
);

jest.mock(
  '@web-api/persistence/postgres/cases/reports/getDocketNumbersByStatusAndByJudge',
  () => mockFactory('getDocketNumbersByStatusAndByJudge'),
);

jest.mock(
  '@web-api/persistence/postgres/cases/reports/getSuggestedCalendarCases',
  () => mockFactory('getSuggestedCalendarCases'),
);

// Statistics

jest.mock(
  '@web-api/persistence/postgres/cases/statistics/createCaseStatistic',
  () => mockFactory('createCaseStatistic'),
);

jest.mock(
  '@web-api/persistence/postgres/cases/statistics/deleteCaseStatistic',
  () => mockFactory('deleteCaseStatistic'),
);

jest.mock(
  '@web-api/persistence/postgres/cases/statistics/updateCaseStatistic',
  () => mockFactory('updateCaseStatistic'),
);

// Mutex

jest.mock('@web-api/persistence/postgres/utils/mutex', () => ({
  mutexLockWrapper: jest.fn().mockImplementation(async ({ _, callback }) => {
    console.debug(`mutexLockWrapper was not implemented, using default mock`);
    return await callback();
  }),
}));
