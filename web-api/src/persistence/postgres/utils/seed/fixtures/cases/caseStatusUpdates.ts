import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { NewCaseStatusUpdateKysely } from '@web-api/database-types';
import { SEEDED_DOCKET_NUMBERS } from '@web-api/persistence/postgres/utils/seed/fixtures/cases/cases';
import { calculateDate } from '@shared/business/utilities/DateHandler';

export const caseStatusUpdates: NewCaseStatusUpdateKysely[] = [
  // 102-67
  {
    changedBy: 'Test Petitionsclerk',
    date: calculateDate({ dateString: '2023-04-03T15:47:49.664Z' }),
    docketNumber: SEEDED_DOCKET_NUMBERS['102-67'],
    updatedCaseStatus: CASE_STATUS_TYPES.new,
  },
  {
    changedBy: 'System',
    date: calculateDate({ dateString: '2023-04-03T15:52:59.423Z' }),
    docketNumber: SEEDED_DOCKET_NUMBERS['102-67'],
    updatedCaseStatus: CASE_STATUS_TYPES.generalDocket,
  },
  {
    changedBy: 'Test Docketclerk',
    date: calculateDate({ dateString: '2023-04-03T15:54:48.112Z' }),
    docketNumber: SEEDED_DOCKET_NUMBERS['102-67'],
    updatedCaseStatus: CASE_STATUS_TYPES.generalDocketReadyForTrial,
  },
];
