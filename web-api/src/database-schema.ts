import { OpenSearchSyncMessage } from '@web-api/lambdas/openSearch/openSearchSyncHandler';
import {
  transformOpenSearchCase,
  indexOpenSearchCase,
} from '../elasticsearch/index-cases';
import {
  DW_USER_CASE_NOTE_COLUMNS,
  UserCaseNoteTable,
} from '@web-api/persistence/postgres/userCaseNotes/schema';
import {
  CaseCorrespondenceTable,
  DW_CASE_CORRESPONDENCE_COLUMNS,
} from '@web-api/persistence/postgres/caseCorrespondences/schema';
import {
  CaseDeadlineTable,
  DW_CASE_DEADLINE_COLUMNS,
} from '@web-api/persistence/postgres/caseDeadlines/schema';
import {
  CaseTable,
  DW_CASE_COLUMNS,
} from '@web-api/persistence/postgres/cases/schema';
import {
  CaseWorksheetTable,
  DW_CASE_WORKSHEET_COLUMNS,
} from '@web-api/persistence/postgres/caseWorksheets/schema';
import {
  DocketEntryTable,
  DW_DOCKET_ENTRY_COLUMNS,
} from '@web-api/persistence/postgres/docketEntries/schema';
import {
  DW_FEATURE_FLAG_COLUMNS,
  FeatureFlagTable,
} from '@web-api/persistence/postgres/featureFlag/schema';
import {
  MessageTable,
  DW_MESSAGE_COLUMNS,
} from '@web-api/persistence/postgres/messages/schema';
import {
  WorkItemTable,
  DW_WORK_ITEM_COLUMNS,
} from '@web-api/persistence/postgres/workitems/schema';
import {
  DW_MINUTE_SHEET_COLUMNS,
  MinuteSheetTable,
} from '@web-api/persistence/postgres/minuteSheets/schema';

const DEFAULT = {};

interface DatabaseSchemaType {
  dwCase: DatabaseTableMetadata<CaseTable>;
  dwCaseCorrespondence: DatabaseTableMetadata<CaseCorrespondenceTable>;
  dwCaseDeadline: DatabaseTableMetadata<CaseDeadlineTable>;
  dwCaseWorksheet: DatabaseTableMetadata<CaseWorksheetTable>;
  dwDocketEntry: DatabaseTableMetadata<DocketEntryTable>;
  dwFeatureFlag: DatabaseTableMetadata<FeatureFlagTable>;
  dwMinuteSheet: DatabaseTableMetadata<MinuteSheetTable>;
  dwMessage: DatabaseTableMetadata<MessageTable>;
  dwUserCaseNote: DatabaseTableMetadata<UserCaseNoteTable>;
  dwWorkItem: DatabaseTableMetadata<WorkItemTable>;
}

// transformOpenSearchMessage takes in a message--a result from the DB--and gets it into the right format to pass into the queue
// indexOpenSearchMessage receives this message from the queue and indexes it into OpenSearch
type DatabaseTableMetadata<TTable> = {
  table: TTable;
  columns: string[];
  transformOpenSearchMessage?: (rawMessage) => {};
  indexOpenSearchMessage?: ({
    message,
  }: {
    message: OpenSearchSyncMessage;
  }) => Promise<void>;
};

export const DatabaseSchema: DatabaseSchemaType = {
  dwCase: {
    table: DEFAULT as CaseTable,
    columns: DW_CASE_COLUMNS,
    transformOpenSearchMessage: transformOpenSearchCase,
    indexOpenSearchMessage: indexOpenSearchCase,
  },
  dwCaseCorrespondence: {
    table: DEFAULT as CaseCorrespondenceTable,
    columns: DW_CASE_CORRESPONDENCE_COLUMNS,
  },
  dwCaseDeadline: {
    table: DEFAULT as CaseDeadlineTable,
    columns: DW_CASE_DEADLINE_COLUMNS,
  },
  dwCaseWorksheet: {
    table: DEFAULT as CaseWorksheetTable,
    columns: DW_CASE_WORKSHEET_COLUMNS,
  },
  dwDocketEntry: {
    table: DEFAULT as DocketEntryTable,
    columns: DW_DOCKET_ENTRY_COLUMNS,
  },
  dwFeatureFlag: {
    table: DEFAULT as FeatureFlagTable,
    columns: DW_FEATURE_FLAG_COLUMNS,
  },
  dwMessage: {
    table: DEFAULT as MessageTable,
    columns: DW_MESSAGE_COLUMNS,
  },
  dwMinuteSheet: {
    table: DEFAULT as MinuteSheetTable,
    columns: DW_MINUTE_SHEET_COLUMNS,
  },
  dwUserCaseNote: {
    table: DEFAULT as UserCaseNoteTable,
    columns: DW_USER_CASE_NOTE_COLUMNS,
  },
  dwWorkItem: {
    table: DEFAULT as WorkItemTable,
    columns: DW_WORK_ITEM_COLUMNS,
  },
};

type ExtractTable<T> = T extends { table: infer U } ? U : never;

export type Database = {
  [K in keyof typeof DatabaseSchema]: ExtractTable<(typeof DatabaseSchema)[K]>;
};
