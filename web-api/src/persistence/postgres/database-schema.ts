import { OpenSearchSyncMessage } from '@web-api/lambdas/openSearch/openSearchSyncHandler';
import { indexOpenSearchCases } from '../../../elasticsearch/cases/indexOpenSearchCases';
import { transformOpenSearchCases } from '../../../elasticsearch/cases/transformOpenSearchCases';
import { transformOpenSearchDocketEntries } from '../../../elasticsearch/docketEntries/transformOpenSearchDocketEntries';
import { indexOpenSearchDocketEntries } from '../../../elasticsearch/docketEntries/indexOpenSearchDocketEntries';
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
  DocketEntryRelatedDocketEntryTable,
  DocketEntryTable,
  DW_DOCKET_ENTRY_COLUMNS,
  DW_DOCKET_ENTRY_ORDER_MOTION_COLUMNS,
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
  ResponseStringTable,
  DW_RESPONSE_STRING_COLUMNS,
} from '@web-api/persistence/postgres/polling/schema';
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
  TrialSessionCaseTable,
  DW_TRIAL_SESSION_CASE_COLUMNS,
  DW_TRIAL_SESSION_COLUMNS,
  DW_TRIAL_SESSION_NOTIFICATION_PROCESSING,
  DW_TRIAL_SESSION_PAPER_PDF_COLUMNS,
  DW_TRIAL_SESSION_WORKING_COPY_COLUMNS,
  TrialSessionNotificationProcessingTable,
  TrialSessionPaperPdfTable,
  TrialSessionTable,
  TrialSessionWorkingCopyTable,
} from '@web-api/persistence/postgres/trialSessions/schema';
import {
  DW_PRACTITIONER_DOCUMENT_COLUMNS,
  PractitionerDocumentTable,
} from '@web-api/persistence/postgres/practitionerDocuments/schema';
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
import {
  DW_USER_ON_CASE_PENDING_COLUMNS,
  UserOnCasePendingTable,
} from '@web-api/persistence/postgres/cases/pendingCases/schema';
import {
  indexOpenSearchUser,
  transformOpenSearchUser,
} from '../../../elasticsearch/index-users';
import { transformOpenSearchUserOnCase } from '../../../elasticsearch/cases/transformOpenSearchUserOnCase';
import {
  BarNumberTable,
  DW_BAR_NUMBER_COLUMNS,
} from '@web-api/persistence/postgres/users/barNumber/schema';

const DEFAULT = {};

interface DatabaseSchemaType {
  dwBarNumber: DatabaseTableMetadata<BarNumberTable>;
  dwCase: DatabaseTableMetadata<CaseTable>;
  dwCaseCorrespondence: DatabaseTableMetadata<CaseCorrespondenceTable>;
  dwCaseDeadline: DatabaseTableMetadata<CaseDeadlineTable>;
  dwTrialSessionCase: DatabaseTableMetadata<TrialSessionCaseTable>;
  dwCaseWorksheet: DatabaseTableMetadata<CaseWorksheetTable>;
  dwChangeOfAddress: DatabaseTableMetadata<ChangeOfAddressTable>;
  dwConnection: DatabaseTableMetadata<ConnectionTable>;
  dwDocketEntry: DatabaseTableMetadata<DocketEntryTable>;
  dwDocketEntryRelatedDocketEntry: DatabaseTableMetadata<DocketEntryRelatedDocketEntryTable>;
  dwDocketEntryWorksheet: DatabaseTableMetadata<DocketEntryWorksheetTable>;
  dwFeatureFlag: DatabaseTableMetadata<FeatureFlagTable>;
  dwMessage: DatabaseTableMetadata<MessageTable>;
  dwMinuteSheet: DatabaseTableMetadata<MinuteSheetTable>;
  dwPractitionerDocuments: DatabaseTableMetadata<PractitionerDocumentTable>;
  dwNotification: DatabaseTableMetadata<NotificationTable>;
  dwUser: DatabaseTableMetadata<UserTable>;
  dwResponseString: DatabaseTableMetadata<ResponseStringTable>;
  dwTrialSession: DatabaseTableMetadata<TrialSessionTable>;
  dwTrialSessionNotificationProcessing: DatabaseTableMetadata<TrialSessionNotificationProcessingTable>;
  dwTrialSessionPaperPdf: DatabaseTableMetadata<TrialSessionPaperPdfTable>;
  dwTrialSessionWorkingCopy: DatabaseTableMetadata<TrialSessionWorkingCopyTable>;
  dwUserCaseNote: DatabaseTableMetadata<UserCaseNoteTable>;
  dwUserConfirmationCode: DatabaseTableMetadata<UserConfirmationCodeTable>;
  dwUserOnCase: DatabaseTableMetadata<UserOnCaseTable>;
  dwUserOnCasePending: DatabaseTableMetadata<UserOnCasePendingTable>;
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
  dwBarNumber: {
    table: DEFAULT as BarNumberTable,
    columns: DW_BAR_NUMBER_COLUMNS,
  },
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
  dwTrialSessionCase: {
    table: DEFAULT as TrialSessionCaseTable,
    columns: DW_TRIAL_SESSION_CASE_COLUMNS,
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
  dwDocketEntryRelatedDocketEntry: {
    table: DEFAULT as DocketEntryRelatedDocketEntryTable,
    columns: DW_DOCKET_ENTRY_ORDER_MOTION_COLUMNS,
  },
  dwDocketEntryWorksheet: {
    table: DEFAULT as DocketEntryWorksheetTable,
    columns: DW_DOCKET_ENTRY_WORKSHEET_COLUMNS,
  },
  dwFeatureFlag: {
    table: DEFAULT as FeatureFlagTable,
    columns: DW_FEATURE_FLAG_COLUMNS,
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
  dwPractitionerDocuments: {
    table: DEFAULT as PractitionerDocumentTable,
    columns: DW_PRACTITIONER_DOCUMENT_COLUMNS,
  },
  dwResponseString: {
    table: DEFAULT as ResponseStringTable,
    columns: DW_RESPONSE_STRING_COLUMNS,
  },
  dwTrialSession: {
    table: DEFAULT as TrialSessionTable,
    columns: DW_TRIAL_SESSION_COLUMNS,
  },
  dwTrialSessionNotificationProcessing: {
    table: DEFAULT as TrialSessionNotificationProcessingTable,
    columns: DW_TRIAL_SESSION_NOTIFICATION_PROCESSING,
  },
  dwTrialSessionPaperPdf: {
    table: DEFAULT as TrialSessionPaperPdfTable,
    columns: DW_TRIAL_SESSION_PAPER_PDF_COLUMNS,
  },
  dwTrialSessionWorkingCopy: {
    table: DEFAULT as TrialSessionWorkingCopyTable,
    columns: DW_TRIAL_SESSION_WORKING_COPY_COLUMNS,
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
    indexOpenSearchMessage: indexOpenSearchUser,
    transformOpenSearchMessage: transformOpenSearchUser,
  },
  dwUserConfirmationCode: {
    table: DEFAULT as UserConfirmationCodeTable,
    columns: DW_USER_CONFIRMATION_CODE_COLUMNS,
  },
  dwUserOnCase: {
    table: DEFAULT as UserOnCaseTable,
    columns: DW_USER_ON_CASE_COLUMNS,
    transformOpenSearchMessage: transformOpenSearchUserOnCase,
    indexOpenSearchMessage: indexOpenSearchCases,
  },
  dwUserOnCasePending: {
    table: DEFAULT as UserOnCasePendingTable,
    columns: DW_USER_ON_CASE_PENDING_COLUMNS,
  },
};

type ExtractTable<T> = T extends { table: infer U } ? U : never;

export type Database = {
  [K in keyof typeof DatabaseSchema]: ExtractTable<(typeof DatabaseSchema)[K]>;
};
