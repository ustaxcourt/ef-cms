import { mockFactory } from '@shared/test/mockFactory';

jest.mock('@web-api/persistence/postgres/cases/createCase', () =>
  mockFactory('createCase'),
);

jest.mock('@web-api/persistence/postgres/cases/generateDocketNumber', () =>
  mockFactory('generateDocketNumber'),
);

jest.mock('@web-api/persistence/postgres/cases/getCaseExists', () =>
  mockFactory('getCaseExists', true),
);

jest.mock('@web-api/persistence/postgres/cases/getCaseByDocketNumber', () =>
  mockFactory('getCaseByDocketNumber'),
);

jest.mock('@web-api/persistence/postgres/cases/getCasesByDocketNumbers', () =>
  mockFactory('getCasesByDocketNumbers'),
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

// Parties

jest.mock(
  '@web-api/persistence/postgres/cases/parties/deletePetitionerOnCase',
  () => mockFactory('deletePetitionerOnCase'),
);

jest.mock(
  '@web-api/persistence/postgres/cases/parties/updatePetitionerOnCase',
  () => mockFactory('updatePetitionerOnCase'),
);

jest.mock(
  '@web-api/persistence/postgres/cases/parties/clearPetitionersOnCase',
  () => mockFactory('clearPetitionersOnCase'),
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
  '@web-api/persistence/postgres/cases/statistics/createCaseStatistics',
  () => mockFactory('createCaseStatistics'),
);

jest.mock(
  '@web-api/persistence/postgres/cases/statistics/deleteCaseStatistic',
  () => mockFactory('deleteCaseStatistic'),
);

jest.mock(
  '@web-api/persistence/postgres/cases/statistics/updateCaseStatistic',
  () => mockFactory('updateCaseStatistic'),
);

jest.mock(
  '@web-api/persistence/postgres/cases/statistics/clearCaseStatistics',
  () => mockFactory('clearCaseStatistics'),
);

// Case status updates

jest.mock('@web-api/persistence/postgres/cases/getCaseStatusHistory', () =>
  mockFactory('getCaseStatusHistory'),
);

jest.mock('@web-api/persistence/postgres/cases/upsertCaseStatusUpdates', () =>
  mockFactory('upsertCaseStatusUpdates'),
);

jest.mock(
  '@web-api/persistence/postgres/cases/createCaseStatusUpdateForCases',
  () => mockFactory('createCaseStatusUpdateForCases'),
);
