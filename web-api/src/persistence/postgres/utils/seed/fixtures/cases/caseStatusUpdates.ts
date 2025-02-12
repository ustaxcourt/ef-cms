/* eslint-disable max-lines */
import { CaseStatusChange } from '@shared/business/entities/cases/Case';
import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { SEEDED_DOCKET_NUMBERS_100_104 } from '@web-api/persistence/postgres/utils/seed/fixtures/cases/cases100_104';
import { SEEDED_DOCKET_NUMBERS_105_109 } from '@web-api/persistence/postgres/utils/seed/fixtures/cases/cases105_109';
import { SEEDED_DOCKET_NUMBERS_400_409 } from '@web-api/persistence/postgres/utils/seed/fixtures/cases/cases400_409';
import { SEEDED_DOCKET_NUMBERS_410_419 } from '@web-api/persistence/postgres/utils/seed/fixtures/cases/cases410_419';
import { SEEDED_DOCKET_NUMBERS_420_429 } from '@web-api/persistence/postgres/utils/seed/fixtures/cases/cases420_429';
import { SEEDED_DOCKET_NUMBERS_430_439 } from '@web-api/persistence/postgres/utils/seed/fixtures/cases/cases430_439';
import { SEEDED_DOCKET_NUMBERS_440_449 } from '@web-api/persistence/postgres/utils/seed/fixtures/cases/cases440_449';
import { SEEDED_DOCKET_NUMBERS_450_plus } from '@web-api/persistence/postgres/utils/seed/fixtures/cases/cases450_plus';

export const caseStatusUpdates: (CaseStatusChange & {
  docketNumber: string;
})[] = [
  // 101-24
  {
    changedBy: 'Test Petitionsclerk',
    date: '2024-06-04T22:34:46.115Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_100_104['101-24'],
    updatedCaseStatus: 'New',
  },
  {
    changedBy: 'System',
    date: '2024-06-04T22:35:01.143Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_100_104['101-24'],
    updatedCaseStatus: 'General Docket - Not at Issue',
  },
  // 102-22
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_100_104['102-22'],
    updatedCaseStatus: 'New',
  },
  // 102-67
  {
    changedBy: 'Test Petitionsclerk',
    date: '2023-04-03T15:47:49.664Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_100_104['102-67'],
    updatedCaseStatus: CASE_STATUS_TYPES.new,
  },
  {
    changedBy: 'System',
    date: '2023-04-03T15:52:59.423Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_100_104['102-67'],
    updatedCaseStatus: CASE_STATUS_TYPES.generalDocket,
  },
  {
    changedBy: 'Test Docketclerk',
    date: '2023-04-03T15:54:48.112Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_100_104['102-67'],
    updatedCaseStatus: CASE_STATUS_TYPES.generalDocketReadyForTrial,
  },
  // 103-67
  {
    changedBy: 'Test Petitionsclerk',
    date: '2023-04-03T15:49:19.618Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_100_104['103-67'],
    updatedCaseStatus: 'New',
  },
  {
    changedBy: 'System',
    date: '2023-04-03T15:53:18.587Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_100_104['103-67'],
    updatedCaseStatus: 'General Docket - Not at Issue',
  },
  {
    changedBy: 'Test Docketclerk',
    date: '2023-04-03T15:55:34.079Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_100_104['103-67'],
    updatedCaseStatus: 'General Docket - At Issue (Ready for Trial)',
  },
  // 104-67
  {
    changedBy: 'Test Petitionsclerk',
    date: '2023-04-03T15:50:59.961Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_100_104['104-67'],
    updatedCaseStatus: 'New',
  },
  {
    changedBy: 'System',
    date: '2023-04-03T15:53:43.150Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_100_104['104-67'],
    updatedCaseStatus: 'General Docket - Not at Issue',
  },
  {
    changedBy: 'Test Docketclerk',
    date: '2023-04-03T15:55:58.398Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_100_104['104-67'],
    updatedCaseStatus: 'General Docket - At Issue (Ready for Trial)',
  },
  // 105-23
  {
    changedBy: 'Petitioner',
    date: '2023-07-26T17:03:31.707Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_105_109['105-23'],
    updatedCaseStatus: 'New',
  },
  {
    changedBy: 'System',
    date: '2023-07-26T17:04:05.684Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_105_109['105-23'],
    updatedCaseStatus: 'General Docket - Not at Issue',
  },
  // 105-67
  {
    changedBy: 'Test Petitionsclerk',
    date: '2023-04-03T15:52:32.342Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_105_109['105-67'],
    updatedCaseStatus: 'New',
  },
  {
    changedBy: 'System',
    date: '2023-04-03T15:52:36.482Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_105_109['105-67'],
    updatedCaseStatus: 'General Docket - Not at Issue',
  },
  {
    changedBy: 'Test Docketclerk',
    date: '2023-04-03T15:57:02.387Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_105_109['105-67'],
    updatedCaseStatus: 'General Docket - At Issue (Ready for Trial)',
  },
  // 400-22
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_400_409['400-22'],
    updatedCaseStatus: 'Submitted - Rule 122',
  },
  // 400-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_400_409['400-23'],
    updatedCaseStatus: 'CAV',
  },
  // 401-22
  {
    changedBy: 'Docketclerk',
    date: '2020-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_400_409['401-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 401-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_400_409['401-23'],
    updatedCaseStatus: 'CAV',
  },
  // 402-22
  {
    changedBy: 'Docketclerk',
    date: '1999-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_400_409['402-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 402-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_400_409['402-23'],
    updatedCaseStatus: 'CAV',
  },
  // 403-22
  {
    changedBy: 'Docketclerk',
    date: '1998-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_400_409['403-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 403-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_400_409['403-23'],
    updatedCaseStatus: 'CAV',
  },
  // 404-22
  {
    changedBy: 'Docketclerk',
    date: '1985-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_400_409['404-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 404-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_400_409['404-23'],
    updatedCaseStatus: 'CAV',
  },
  // 405-22
  {
    changedBy: 'Docketclerk',
    date: '1986-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_400_409['405-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 405-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_400_409['400-23'],
    updatedCaseStatus: 'CAV',
  },
  // 406-22
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_400_409['406-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 406-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_400_409['406-23'],
    updatedCaseStatus: 'CAV',
  },
  // 407-22
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_400_409['407-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 407-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_400_409['407-23'],
    updatedCaseStatus: 'CAV',
  },
  // 408-22
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_400_409['408-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 408-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_400_409['408-23'],
    updatedCaseStatus: 'CAV',
  },
  // 409-22
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_400_409['409-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 409-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_400_409['409-23'],
    updatedCaseStatus: 'CAV',
  },
  // 410-22
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_410_419['410-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 410-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_410_419['410-23'],
    updatedCaseStatus: 'CAV',
  },
  // 411-22
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_410_419['411-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 411-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_410_419['411-23'],
    updatedCaseStatus: 'CAV',
  },
  // 412-22
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_410_419['412-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 412-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_410_419['412-23'],
    updatedCaseStatus: 'CAV',
  },
  // 413-22
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_410_419['413-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 413-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_410_419['413-23'],
    updatedCaseStatus: 'CAV',
  },
  // 414-22
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_410_419['414-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 414-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_410_419['414-23'],
    updatedCaseStatus: 'CAV',
  },
  // 415-22
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_410_419['415-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 415-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_410_419['415-23'],
    updatedCaseStatus: 'CAV',
  },
  // 416-22
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_410_419['416-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 416-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_410_419['416-23'],
    updatedCaseStatus: 'CAV',
  },
  // 417-22
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_410_419['417-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 417-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_410_419['417-23'],
    updatedCaseStatus: 'CAV',
  },
  // 418-22
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_410_419['418-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 418-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_410_419['418-23'],
    updatedCaseStatus: 'CAV',
  },
  // 419-22
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_410_419['419-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 419-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_410_419['419-23'],
    updatedCaseStatus: 'CAV',
  },
  // 420-22
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_420_429['420-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 420-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_420_429['420-23'],
    updatedCaseStatus: 'CAV',
  },
  // 421-22
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_420_429['421-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 421-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_420_429['421-23'],
    updatedCaseStatus: 'CAV',
  },
  // 422-22
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_420_429['422-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 422-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_420_429['422-23'],
    updatedCaseStatus: 'CAV',
  },
  // 423-22
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_420_429['423-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 423-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_420_429['423-23'],
    updatedCaseStatus: 'CAV',
  },
  // 424-22
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_420_429['424-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 424-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_420_429['424-23'],
    updatedCaseStatus: 'CAV',
  },
  // 425-22
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_420_429['425-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 425-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_420_429['425-23'],
    updatedCaseStatus: 'CAV',
  },
  // 426-22
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_420_429['426-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 426-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_420_429['426-23'],
    updatedCaseStatus: 'CAV',
  },
  // 427-22
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_420_429['427-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 427-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_420_429['427-23'],
    updatedCaseStatus: 'CAV',
  },
  // 428-22
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_420_429['428-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 428-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_420_429['428-23'],
    updatedCaseStatus: 'CAV',
  },
  // 429-22
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_420_429['429-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 429-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_420_429['429-23'],
    updatedCaseStatus: 'CAV',
  },
  // 430-22
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_430_439['430-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 430-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_430_439['430-23'],
    updatedCaseStatus: 'CAV',
  },
  // 431-22
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_430_439['431-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 431-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_430_439['431-23'],
    updatedCaseStatus: 'CAV',
  },
  // 432-22
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_430_439['432-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 432-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_430_439['432-23'],
    updatedCaseStatus: 'CAV',
  },
  // 433-22
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_430_439['433-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 433-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_430_439['433-23'],
    updatedCaseStatus: 'CAV',
  },
  // 434-22
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_430_439['434-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 434-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_430_439['434-23'],
    updatedCaseStatus: 'CAV',
  },
  // 435-22
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_430_439['435-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 435-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_430_439['435-23'],
    updatedCaseStatus: 'CAV',
  },
  // 436-22
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_430_439['436-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 436-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_430_439['436-23'],
    updatedCaseStatus: 'CAV',
  },
  // 437-22
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_430_439['437-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 437-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_430_439['437-23'],
    updatedCaseStatus: 'CAV',
  },
  // 438-22
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_430_439['438-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 438-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_430_439['438-23'],
    updatedCaseStatus: 'CAV',
  },
  // 439-22
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_430_439['439-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 439-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_430_439['439-23'],
    updatedCaseStatus: 'CAV',
  },
  // 440-22
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_440_449['440-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 440-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_440_449['440-23'],
    updatedCaseStatus: 'CAV',
  },
  // 441-22
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_440_449['441-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 441-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_440_449['441-23'],
    updatedCaseStatus: 'CAV',
  },
  // 442-22
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_440_449['442-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 442-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_440_449['442-23'],
    updatedCaseStatus: 'CAV',
  },
  // 443-22
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_440_449['443-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 443-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_440_449['443-23'],
    updatedCaseStatus: 'CAV',
  },
  // 444-22
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_440_449['444-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 444-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_440_449['444-23'],
    updatedCaseStatus: 'CAV',
  },
  // 445-22
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_440_449['445-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 445-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_440_449['445-23'],
    updatedCaseStatus: 'CAV',
  },
  // 446-22
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_440_449['446-22'],
    updatedCaseStatus: 'Submitted',
  },
  // 446-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_440_449['446-23'],
    updatedCaseStatus: 'CAV',
  },
  // 447-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_440_449['447-23'],
    updatedCaseStatus: 'CAV',
  },
  // 448-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_440_449['448-23'],
    updatedCaseStatus: 'CAV',
  },
  // 449-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_440_449['449-23'],
    updatedCaseStatus: 'CAV',
  },
  // 450-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_450_plus['450-23'],
    updatedCaseStatus: 'CAV',
  },
  // 451-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_450_plus['451-23'],
    updatedCaseStatus: 'CAV',
  },
  // 452-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_450_plus['452-23'],
    updatedCaseStatus: 'CAV',
  },
  // 453-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_450_plus['453-23'],
    updatedCaseStatus: 'CAV',
  },
  // 454-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_450_plus['454-23'],
    updatedCaseStatus: 'CAV',
  },
  // 455-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_450_plus['455-23'],
    updatedCaseStatus: 'CAV',
  },
  // 456-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_450_plus['456-23'],
    updatedCaseStatus: 'CAV',
  },
  // 457-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_450_plus['457-23'],
    updatedCaseStatus: 'CAV',
  },
  // 458-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_450_plus['458-23'],
    updatedCaseStatus: 'CAV',
  },
  // 459-23
  {
    changedBy: 'Docketclerk',
    date: '2022-12-21T19:03:01.908Z',
    docketNumber: SEEDED_DOCKET_NUMBERS_450_plus['459-23'],
    updatedCaseStatus: 'CAV',
  },
];
