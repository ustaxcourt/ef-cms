import { CaseStatisticKysely } from '@web-api/database-types';
import { SEEDED_DOCKET_NUMBERS_105_109 } from '@web-api/persistence/postgres/utils/seed/fixtures/cases/cases105_109';
import { SEEDED_DOCKET_NUMBERS_310_399 } from '@web-api/persistence/postgres/utils/seed/fixtures/cases/cases310_399';

export const caseStatistics: CaseStatisticKysely[] = [
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
  // 320-21
  {
    docketNumber: SEEDED_DOCKET_NUMBERS_310_399['320-21'],
    irsDeficiencyAmount: 1500.0, // "1500.00"
    irsTotalPenalties: 150.0, // "150.00"
    statisticId: '38128813-53b7-4c53-acc2-33eb31ebc0ef',
    year: 2019,
    yearOrPeriod: 'Year',
  },
];
