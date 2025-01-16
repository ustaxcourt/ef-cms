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

jest.mock('@web-api/persistence/postgres/cases/updateCase', () =>
  mockFactory('updateCase'),
);

jest.mock('@web-api/persistence/postgres/cases/upsertCases', () =>
  mockFactory('upsertCases'),
);

// Parties

jest.mock(
  '@web-api/persistence/postgres/cases/parties/createCasePetitionersData',
  () => mockFactory('createCasePetitionersData'),
);

jest.mock(
  '@web-api/persistence/postgres/cases/parties/deleteCasePetitionerData',
  () => mockFactory('deleteCasePetitionerData'),
);

jest.mock(
  '@web-api/persistence/postgres/cases/parties/updateCasePetitionerData',
  () => mockFactory('updateCasePetitionerData'),
);

jest.mock(
  '@web-api/persistence/postgres/cases/parties/upsertPractitionersOnCase',
  () => mockFactory('upsertPractitionersOnCase'),
);

// Reports

jest.mock(
  '@web-api/persistence/postgres/cases/reports/caseAdvancedSearch',
  () => mockFactory('caseAdvancedSearch'),
);

jest.mock('@web-api/persistence/postgres/cases/reports/casePublicSearch', () =>
  mockFactory('casePublicSearch'),
);

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

jest.mock('@web-api/persistence/postgres/cases/reports/getColdCases', () =>
  mockFactory('getColdCases'),
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
