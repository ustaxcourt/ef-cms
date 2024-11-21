import { CaseStatisticsKysely } from '@web-api/database-types';
import { SEEDED_DOCKET_NUMBERS_105_109 } from '@web-api/persistence/postgres/utils/seed/fixtures/cases/cases105_109';

export const caseStatistics: CaseStatisticsKysely[] = [
  // 105-20
  {
    docketNumber: SEEDED_DOCKET_NUMBERS_105_109['105-20'],
    irsDeficiencyAmount: 5678,
    irsTotalPenalties: 1234,
    statisticId: 'cb557361-50ee-4440-aaff-0a9f1bfa30ed',
    year: 2018,
    yearOrPeriod: 'Year',
  },
  {
    docketNumber: SEEDED_DOCKET_NUMBERS_105_109['105-20'],
    irsDeficiencyAmount: 55,
    irsTotalPenalties: 99,
    statisticId: 'ab557361-50ee-4440-aaff-0a9f1bfa30ed',
    year: 2019,
    yearOrPeriod: 'Year',
  },
];
