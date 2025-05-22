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
  MessageTable,
  DW_MESSAGE_COLUMNS,
} from '@web-api/persistence/postgres/messages/schema';
import {
  WorkItemTable,
  DW_WORK_ITEM_COLUMNS,
} from '@web-api/persistence/postgres/workitems/schema';
import {
  ConnectionTable,
  DW_CONNECTION_COLUMNS,
} from '@web-api/persistence/postgres/connections/schema';
import {
  DW_NOTIFICATION_COLUMNS,
  NotificationTable,
} from '@web-api/persistence/postgres/notifications/schema';
import {
  ChangeOfAddressTable,
  DW_CHANGE_OF_ADDRESS_COLUMNS,
} from '@web-api/persistence/postgres/jobs/changeOfAddress/schema';

const DEFAULT = {};

interface DatabaseSchemaType {
  dwCase: DatabaseTableMetadata<CaseTable>;
  dwCaseCorrespondence: DatabaseTableMetadata<CaseCorrespondenceTable>;
  dwCaseDeadline: DatabaseTableMetadata<CaseDeadlineTable>;
  dwCaseWorksheet: DatabaseTableMetadata<CaseWorksheetTable>;
  dwChangeOfAddress: DatabaseTableMetadata<ChangeOfAddressTable>;
  dwConnection: DatabaseTableMetadata<ConnectionTable>;
  dwDocketEntry: DatabaseTableMetadata<DocketEntryTable>;
  dwMessage: DatabaseTableMetadata<MessageTable>;
  dwNotification: DatabaseTableMetadata<NotificationTable>;
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
  dwChangeOfAddress: {
    table: DEFAULT as ChangeOfAddressTable,
    columns: DW_CHANGE_OF_ADDRESS_COLUMNS,
  },
  dwConnection: {
    table: DEFAULT as ConnectionTable,
    columns: DW_CONNECTION_COLUMNS,
  },
  dwDocketEntry: {
    table: DEFAULT as DocketEntryTable,
    columns: DW_DOCKET_ENTRY_COLUMNS,
  },
  dwMessage: {
    table: DEFAULT as MessageTable,
    columns: DW_MESSAGE_COLUMNS,
  },
  dwNotification: {
    table: DEFAULT as NotificationTable,
    columns: DW_NOTIFICATION_COLUMNS,
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
