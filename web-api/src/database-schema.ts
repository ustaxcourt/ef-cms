import { OpenSearchSyncMessage } from '@web-api/lambdas/openSearch/openSearchSyncHandler';
import { indexOpenSearchCases } from '../elasticsearch/cases/indexOpenSearchCases';
import { transformOpenSearchCases } from '../elasticsearch/cases/transformOpenSearchCases';
import { transformOpenSearchDocketEntries } from '../elasticsearch/docketEntries/transformOpenSearchDocketEntries';
import { indexOpenSearchDocketEntries } from '../elasticsearch/docketEntries/indexOpenSearchDocketEntries';
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
import {
  DocketEntryWorksheetTable,
  DW_DOCKET_ENTRY_WORKSHEET_COLUMNS,
} from '@web-api/persistence/postgres/docketEntryWorksheets/schema';
import {
  DW_MINUTE_SHEET_COLUMNS,
  MinuteSheetTable,
} from '@web-api/persistence/postgres/minuteSheets/schema';
import {
  DW_USER_COLUMNS,
  UserTable,
} from '@web-api/persistence/postgres/users/schema';
import {
  DW_USER_ON_CASE_COLUMNS,
  UserOnCaseTable,
} from '@web-api/persistence/postgres/cases/userOnCase/schema';
import {
  DW_USER_CONFIRMATION_CODE_COLUMNS,
  UserConfirmationCodeTable,
} from '@web-api/persistence/postgres/users/confirmationCodes/schema';

const DEFAULT = {};

interface DatabaseSchemaType {
  dwCase: DatabaseTableMetadata<CaseTable>;
  dwCaseCorrespondence: DatabaseTableMetadata<CaseCorrespondenceTable>;
  dwCaseDeadline: DatabaseTableMetadata<CaseDeadlineTable>;
  dwCaseWorksheet: DatabaseTableMetadata<CaseWorksheetTable>;
  dwChangeOfAddress: DatabaseTableMetadata<ChangeOfAddressTable>;
  dwConnection: DatabaseTableMetadata<ConnectionTable>;
  dwDocketEntry: DatabaseTableMetadata<DocketEntryTable>;
  dwDocketEntryWorksheet: DatabaseTableMetadata<DocketEntryWorksheetTable>;
  dwMessage: DatabaseTableMetadata<MessageTable>;
  dwMinuteSheet: DatabaseTableMetadata<MinuteSheetTable>;
  dwNotification: DatabaseTableMetadata<NotificationTable>;
  dwUser: DatabaseTableMetadata<UserTable>;
  dwUserCaseNote: DatabaseTableMetadata<UserCaseNoteTable>;
  dwUserConfirmationCode: DatabaseTableMetadata<UserConfirmationCodeTable>;
  dwUserOnCase: DatabaseTableMetadata<UserOnCaseTable>;
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
    transformOpenSearchMessage: transformOpenSearchCases,
    indexOpenSearchMessage: indexOpenSearchCases,
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
    transformOpenSearchMessage: transformOpenSearchDocketEntries,
    indexOpenSearchMessage: indexOpenSearchDocketEntries,
  },
  dwDocketEntryWorksheet: {
    table: DEFAULT as DocketEntryWorksheetTable,
    columns: DW_DOCKET_ENTRY_WORKSHEET_COLUMNS,
  },
  dwMessage: {
    table: DEFAULT as MessageTable,
    columns: DW_MESSAGE_COLUMNS,
  },
  dwNotification: {
    table: DEFAULT as NotificationTable,
    columns: DW_NOTIFICATION_COLUMNS,
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
  dwUser: {
    table: DEFAULT as UserTable,
    columns: DW_USER_COLUMNS,
  },
  dwUserConfirmationCode: {
    table: DEFAULT as UserConfirmationCodeTable,
    columns: DW_USER_CONFIRMATION_CODE_COLUMNS,
  },
  dwUserOnCase: {
    table: DEFAULT as UserOnCaseTable,
    columns: DW_USER_ON_CASE_COLUMNS,
  },
};

type ExtractTable<T> = T extends { table: infer U } ? U : never;

export type Database = {
  [K in keyof typeof DatabaseSchema]: ExtractTable<(typeof DatabaseSchema)[K]>;
};
