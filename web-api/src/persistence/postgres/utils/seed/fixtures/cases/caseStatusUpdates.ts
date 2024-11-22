import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { NewCaseStatusUpdateKysely } from '@web-api/database-types';
import { SEEDED_DOCKET_NUMBERS_100_104 } from '@web-api/persistence/postgres/utils/seed/fixtures/cases/cases100_104';
import { SEEDED_DOCKET_NUMBERS_105_109 } from '@web-api/persistence/postgres/utils/seed/fixtures/cases/cases105_109';
import { calculateDate } from '@shared/business/utilities/DateHandler';

export const caseStatusUpdates: NewCaseStatusUpdateKysely[] = [
  // 101-24
  {
    changedBy: 'Test Petitionsclerk',
    date: calculateDate({ dateString: '2024-06-04T22:34:46.115Z' }),
    docketNumber: SEEDED_DOCKET_NUMBERS_100_104['101-24'],
    updatedCaseStatus: 'New',
  },
  {
    changedBy: 'System',
    date: calculateDate({ dateString: '2024-06-04T22:35:01.143Z' }),
    docketNumber: SEEDED_DOCKET_NUMBERS_100_104['101-24'],
    updatedCaseStatus: 'General Docket - Not at Issue',
  },
  // 102-22
  {
    changedBy: 'Docketclerk',
    date: calculateDate({ dateString: '2022-12-21T19:03:01.908Z' }),
    docketNumber: SEEDED_DOCKET_NUMBERS_100_104['102-22'],
    updatedCaseStatus: 'New',
  },
  // 102-67
  {
    changedBy: 'Test Petitionsclerk',
    date: calculateDate({ dateString: '2023-04-03T15:47:49.664Z' }),
    docketNumber: SEEDED_DOCKET_NUMBERS_100_104['102-67'],
    updatedCaseStatus: CASE_STATUS_TYPES.new,
  },
  {
    changedBy: 'System',
    date: calculateDate({ dateString: '2023-04-03T15:52:59.423Z' }),
    docketNumber: SEEDED_DOCKET_NUMBERS_100_104['102-67'],
    updatedCaseStatus: CASE_STATUS_TYPES.generalDocket,
  },
  {
    changedBy: 'Test Docketclerk',
    date: calculateDate({ dateString: '2023-04-03T15:54:48.112Z' }),
    docketNumber: SEEDED_DOCKET_NUMBERS_100_104['102-67'],
    updatedCaseStatus: CASE_STATUS_TYPES.generalDocketReadyForTrial,
  },
  // 103-67
  {
    changedBy: 'Test Petitionsclerk',
    date: calculateDate({ dateString: '2023-04-03T15:49:19.618Z' }),
    docketNumber: SEEDED_DOCKET_NUMBERS_100_104['103-67'],
    updatedCaseStatus: 'New',
  },
  {
    changedBy: 'System',
    date: calculateDate({ dateString: '2023-04-03T15:53:18.587Z' }),
    docketNumber: SEEDED_DOCKET_NUMBERS_100_104['103-67'],
    updatedCaseStatus: 'General Docket - Not at Issue',
  },
  {
    changedBy: 'Test Docketclerk',
    date: calculateDate({ dateString: '2023-04-03T15:55:34.079Z' }),
    docketNumber: SEEDED_DOCKET_NUMBERS_100_104['103-67'],
    updatedCaseStatus: 'General Docket - At Issue (Ready for Trial)',
  },
  // 104-67
  {
    changedBy: 'Test Petitionsclerk',
    date: calculateDate({ dateString: '2023-04-03T15:50:59.961Z' }),
    docketNumber: SEEDED_DOCKET_NUMBERS_100_104['104-67'],
    updatedCaseStatus: 'New',
  },
  {
    changedBy: 'System',
    date: calculateDate({ dateString: '2023-04-03T15:53:43.150Z' }),
    docketNumber: SEEDED_DOCKET_NUMBERS_100_104['104-67'],
    updatedCaseStatus: 'General Docket - Not at Issue',
  },
  {
    changedBy: 'Test Docketclerk',
    date: calculateDate({ dateString: '2023-04-03T15:55:58.398Z' }),
    docketNumber: SEEDED_DOCKET_NUMBERS_100_104['104-67'],
    updatedCaseStatus: 'General Docket - At Issue (Ready for Trial)',
  },
  // 105-23
  {
    changedBy: 'Petitioner',
    date: calculateDate({ dateString: '2023-07-26T17:03:31.707Z' }),
    docketNumber: SEEDED_DOCKET_NUMBERS_105_109['105-23'],
    updatedCaseStatus: 'New',
  },
  {
    changedBy: 'System',
    date: calculateDate({ dateString: '2023-07-26T17:04:05.684Z' }),
    docketNumber: SEEDED_DOCKET_NUMBERS_105_109['105-23'],
    updatedCaseStatus: 'General Docket - Not at Issue',
  },
];
