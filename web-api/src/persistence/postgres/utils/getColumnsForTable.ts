import { DW_CASE_CORRESPONDENCE_COLUMNS } from '@web-api/persistence/postgres/caseCorrespondences/mapper';
import { DW_CASE_DEADLINE_COLUMNS } from '@web-api/persistence/postgres/caseDeadlines/mapper';
import {
  DW_CASE_COLUMNS,
  DW_CASE_STATISTIC_COLUMNS,
  DW_CASE_STATUS_UPDATES_COLUMNS,
  DW_PETITIONERS_ON_CASE_COLUMNS,
  DW_STATISTIC_PENALTY_COLUMNS,
} from '@web-api/persistence/postgres/cases/mapper';
import { DW_CASE_WORKSHEET_COLUMNS } from '@web-api/persistence/postgres/caseWorksheets/mapper';
import { DW_DOCKET_ENTRY_COLUMNS } from '@web-api/persistence/postgres/docketEntries/mapper';
import { DW_MESSAGE_COLUMNS } from '@web-api/persistence/postgres/messages/mapper';
import { DW_USER_CASE_NOTE_COLUMNS } from '@web-api/persistence/postgres/userCaseNotes/mapper';
import { DW_WORK_ITEM_COLUMNS } from '@web-api/persistence/postgres/workitems/mapper';

const columnsByTable: Record<string, any[]> = {
  dwCase: DW_CASE_COLUMNS,
  dwCaseCorrespondence: DW_CASE_CORRESPONDENCE_COLUMNS,
  dwCaseDeadline: DW_CASE_DEADLINE_COLUMNS,
  dwCaseStatistic: DW_CASE_STATISTIC_COLUMNS,
  dwCaseStatusUpdate: DW_CASE_STATUS_UPDATES_COLUMNS,
  dwCaseWorksheet: DW_CASE_WORKSHEET_COLUMNS,
  dwDocketEntry: DW_DOCKET_ENTRY_COLUMNS,
  dwMessage: DW_MESSAGE_COLUMNS,
  dwPetitionerOnCase: DW_PETITIONERS_ON_CASE_COLUMNS,
  dwStatisticPenalty: DW_STATISTIC_PENALTY_COLUMNS,
  dwUserCaseNote: DW_USER_CASE_NOTE_COLUMNS,
  dwWorkItem: DW_WORK_ITEM_COLUMNS,
};

export const getColumnsForTable = (table: string): any[] => {
  return columnsByTable[table] || [];
};
