import { OpenSearchSyncMessage } from '@web-api/lambdas/openSearch/openSearchSyncHandler';
import { ColumnType, Insertable, Selectable, Updateable } from 'kysely';
import {
  filterCaseBeforeSendingThroughQueue,
  openSearchIndexCase,
} from '../../web-api/elasticsearch/index-cases';

const DEFAULT = {};

const messageTableDefinition = {
  attachments: DEFAULT as
    | ColumnType<{ documentId: string }[], string, string>
    | undefined,
  completedAt: DEFAULT as Date | undefined,
  completedBy: DEFAULT as string | undefined,
  completedBySection: DEFAULT as string | undefined,
  completedByUserId: DEFAULT as string | undefined,
  completedMessage: DEFAULT as string | undefined,
  createdAt: DEFAULT as Date,
  docketNumber: DEFAULT as string,
  from: DEFAULT as string,
  fromSection: DEFAULT as string,
  fromUserId: DEFAULT as string,
  isCompleted: DEFAULT as boolean,
  isRead: DEFAULT as boolean,
  isRepliedTo: DEFAULT as boolean,
  message: DEFAULT as string,
  messageId: DEFAULT as string,
  parentMessageId: DEFAULT as string,
  subject: DEFAULT as string,
  to: DEFAULT as string,
  toSection: DEFAULT as string,
  toUserId: DEFAULT as string,
};

export type MessageTable = typeof messageTableDefinition;

export const DW_MESSAGE_COLUMNS = Object.keys(messageTableDefinition) as Array<
  keyof MessageTable
>;

export type MessageKysely = Selectable<MessageTable>;
export type NewMessageKysely = Insertable<MessageTable>;
export type UpdateMessageKysely = Updateable<MessageTable>;

const caseTableDefinition = {
  associatedJudge: DEFAULT as string | undefined,
  associatedJudgeId: DEFAULT as string | undefined,
  automaticBlocked: DEFAULT as boolean | undefined,
  automaticBlockedDate: DEFAULT as Date | null,
  automaticBlockedReason: DEFAULT as string | undefined,
  blocked: DEFAULT as boolean | undefined,
  blockedDate: DEFAULT as Date | null,
  blockedReason: DEFAULT as string | undefined,
  canAllowDocumentService: DEFAULT as boolean | undefined,
  canAllowPrintableDocketRecord: DEFAULT as boolean | undefined,
  canDojPractitionersRepresentParty: DEFAULT as boolean | undefined,
  caption: DEFAULT as string,
  caseNote: DEFAULT as string | undefined,
  caseType: DEFAULT as string,
  closedDate: DEFAULT as Date | null,
  createdAt: DEFAULT as Date,
  damages: DEFAULT as number | undefined,
  docketNumber: DEFAULT as string,
  docketNumberSuffix: DEFAULT as string | undefined,
  docketEntries: DEFAULT as
    | ColumnType<
        { docketEntryId: string; docketNumber: string }[],
        string,
        string
      >
    | undefined,
  filingType: DEFAULT as string | undefined,
  hasPendingItems: DEFAULT as boolean | undefined,
  hasVerifiedIrsNotice: DEFAULT as boolean | undefined,
  hearings: DEFAULT as
    | ColumnType<{ trialSessionId: string }[], string, string>
    | undefined,
  highPriority: DEFAULT as boolean | undefined,
  highPriorityReason: DEFAULT as string | undefined,
  initialCaption: DEFAULT as string | undefined,
  initialDocketNumberSuffix: DEFAULT as string | undefined,
  irsNoticeDate: DEFAULT as Date | null,
  isPaper: DEFAULT as boolean | null | undefined,
  isSealed: DEFAULT as boolean | null | undefined,
  judgeUserId: DEFAULT as string | undefined,
  leadDocketNumber: DEFAULT as string | null | undefined,
  litigationCosts: DEFAULT as number | undefined,
  mailingDate: DEFAULT as string | undefined,
  noticeOfAttachments: DEFAULT as boolean | undefined,
  noticeOfTrialDate: DEFAULT as Date | null,
  orderDesignatingPlaceOfTrial: DEFAULT as boolean | undefined,
  orderForAmendedPetition: DEFAULT as boolean | undefined,
  orderForAmendedPetitionAndFilingFee: DEFAULT as boolean | undefined,
  orderForCds: DEFAULT as boolean | undefined,
  orderForFilingFee: DEFAULT as boolean | undefined,
  orderForRatification: DEFAULT as boolean | undefined,
  orderToShowCause: DEFAULT as boolean | undefined,
  partyType: DEFAULT as string,
  petitionPaymentDate: DEFAULT as Date | null,
  petitionPaymentMethod: DEFAULT as string | undefined,
  petitionPaymentStatus: DEFAULT as string,
  petitionPaymentWaivedDate: DEFAULT as Date | null,
  preferredTrialCity: DEFAULT as string | undefined,
  procedureType: DEFAULT as string,
  qcCompleteForTrial: DEFAULT as
    | ColumnType<{ trialSessionId: string }, string, string>
    | undefined,
  receivedAt: DEFAULT as Date,
  sealedDate: DEFAULT as Date | null,
  sortableDocketNumber: 0 as number,
  status: DEFAULT as string,
  trialDate: DEFAULT as Date | null,
  trialLocation: DEFAULT as string | null,
  trialSessionId: DEFAULT as string | null,
  trialTime: DEFAULT as string | null,
  useSameAsPrimary: DEFAULT as boolean | undefined,
};

export type CaseTable = typeof caseTableDefinition;

export const DW_CASE_COLUMNS = Object.keys(caseTableDefinition) as Array<
  keyof CaseTable
>;

export type CaseKysely = Selectable<CaseTable>;
export type NewCaseKysely = Insertable<CaseTable>;
export type UpdateCaseKysely = Updateable<CaseTable>;

const caseCorrespondenceTableDefinition = {
  archived: DEFAULT as boolean | undefined,
  correspondenceId: DEFAULT as string,
  documentTitle: DEFAULT as string,
  filedBy: DEFAULT as string | undefined,
  filingDate: DEFAULT as Date,
  userId: DEFAULT as string,
  docketNumber: DEFAULT as string,
};

export type CaseCorrespondenceTable = typeof caseCorrespondenceTableDefinition;

export const DW_CASE_CORRESPONDENCE_COLUMNS = Object.keys(
  caseCorrespondenceTableDefinition,
) as Array<keyof CaseTable>;

export type CaseCorrespondenceKysely = Selectable<CaseCorrespondenceTable>;
export type NewCaseCorrespondenceKysely = Insertable<CaseCorrespondenceTable>;
export type UpdateCaseCorrespondenceKysely =
  Updateable<CaseCorrespondenceTable>;

const caseDeadlineTableDefinition = {
  associatedJudge: DEFAULT as string,
  associatedJudgeId: DEFAULT as string | undefined,
  caseDeadlineId: DEFAULT as string,
  createdAt: DEFAULT as Date,
  deadlineDate: DEFAULT as Date,
  description: DEFAULT as string,
  docketNumber: DEFAULT as string,
  sortableDocketNumber: DEFAULT as number,
};

export type CaseDeadlineTable = typeof caseDeadlineTableDefinition;

export const DW_CASE_DEADLINE_COLUMNS = Object.keys(
  caseDeadlineTableDefinition,
) as Array<keyof CaseDeadlineTable>;

export type CaseDeadlineKysely = Selectable<CaseDeadlineTable>;
export type NewCaseDeadlineKysely = Insertable<CaseDeadlineTable>;
export type UpdateCaseDeadlineKysely = Updateable<CaseDeadlineTable>;

const caseWorksheetTableDefinition = {
  docketNumber: DEFAULT as string,
  finalBriefDueDate: DEFAULT as Date | null | undefined,
  primaryIssue: DEFAULT as string | undefined,
  statusOfMatter: DEFAULT as string | undefined,
  judgeUserId: DEFAULT as string | undefined,
};

export type CaseWorksheetTable = typeof caseWorksheetTableDefinition;

export const DW_CASE_WORKSHEET_COLUMNS = Object.keys(
  caseWorksheetTableDefinition,
) as Array<keyof CaseWorksheetTable>;

export type CaseWorksheetKysely = Selectable<CaseWorksheetTable>;
export type NewCaseWorksheetKysely = Insertable<CaseWorksheetTable>;
export type UpdateCaseWorksheetKysely = Updateable<CaseWorksheetTable>;

const workItemTableDefinition = {
  assigneeId: DEFAULT as string | undefined,
  assigneeName: DEFAULT as string | undefined,
  associatedJudge: DEFAULT as string,
  associatedJudgeId: DEFAULT as string | undefined,
  caseIsInProgress: DEFAULT as boolean | undefined,
  completedAt: DEFAULT as Date | undefined,
  completedBy: DEFAULT as string | undefined,
  completedByUserId: DEFAULT as string | undefined,
  completedMessage: DEFAULT as string | undefined,
  createdAt: DEFAULT as Date,
  docketEntry: DEFAULT as any,
  docketNumber: DEFAULT as string,
  hideFromPendingMessages: DEFAULT as boolean | undefined,
  highPriority: DEFAULT as boolean | undefined,
  inProgress: DEFAULT as boolean | undefined,
  isInitializeCase: DEFAULT as boolean | undefined,
  isRead: DEFAULT as boolean | undefined,
  section: DEFAULT as string,
  sentBy: DEFAULT as string,
  sentBySection: DEFAULT as string | undefined,
  sentByUserId: DEFAULT as string | undefined,
  updatedAt: DEFAULT as Date,
  workItemId: DEFAULT as string,
};

export type WorkItemTable = typeof workItemTableDefinition;

export const DW_WORK_ITEM_COLUMNS = Object.keys(
  workItemTableDefinition,
) as Array<keyof WorkItemTable>;

export type WorkItemKysely = Selectable<WorkItemTable>;
export type NewWorkItemKysely = Insertable<WorkItemTable>;
export type UpdateWorkItemKysely = Updateable<WorkItemTable>;

const petitionerOnCaseTableDefinition = {
  additionalName: DEFAULT as string | undefined,
  contactType: DEFAULT as string,
  docketNumber: DEFAULT as string,
  hasConsentedToElectronicService: DEFAULT as boolean | undefined,
  hasElectronicAccess: DEFAULT as boolean | undefined,
  inCareOf: DEFAULT as string | undefined,
  isAddressSealed: DEFAULT as boolean,
  paperPetitionEmail: DEFAULT as string | undefined,
  placeOfLegalResidence: DEFAULT as string | undefined,
  sealedAndUnavailable: DEFAULT as boolean | undefined,
  secondaryName: DEFAULT as string | undefined,
  serviceIndicator: DEFAULT as string | undefined,
  title: DEFAULT as string | undefined,
  orderOnCase: DEFAULT as number,

  // Maybe break this out into a contact table down the road
  address1: DEFAULT as string,
  address2: DEFAULT as string | undefined,
  address3: DEFAULT as string | undefined,
  city: DEFAULT as string,
  contactId: DEFAULT as string,
  country: DEFAULT as string | undefined,
  countryType: DEFAULT as string,
  email: DEFAULT as string | undefined,
  name: DEFAULT as string,
  phone: DEFAULT as string,
  postalCode: DEFAULT as string,
  state: DEFAULT as string | undefined,
};

export type PetitionerOnCaseTable = typeof petitionerOnCaseTableDefinition;

export const DW_PETITIONERS_ON_CASE_COLUMNS = Object.keys(
  petitionerOnCaseTableDefinition,
) as Array<keyof PetitionerOnCaseTable>;

export type PetitionerOnCaseKysely = Selectable<PetitionerOnCaseTable>;
export type NewPetitionerOnCaseKysely = Insertable<PetitionerOnCaseTable>;
export type UpdatePetitionerOnCaseKysely = Updateable<PetitionerOnCaseTable>;

const caseStatusUpdateTableDefinition = {
  statusUpdateId: DEFAULT as string,
  changedBy: DEFAULT as string,
  date: DEFAULT as Date,
  docketNumber: DEFAULT as string,
  updatedCaseStatus: DEFAULT as string,
};

export type CaseStatusUpdateTable = typeof caseStatusUpdateTableDefinition;

export const DW_CASE_STATUS_UPDATES_COLUMNS = Object.keys(
  caseStatusUpdateTableDefinition,
) as Array<keyof CaseStatusUpdateTable>;

export type CaseStatusUpdateKysely = Selectable<CaseStatusUpdateTable>;
export type NewCaseStatusUpdateKysely = Insertable<CaseStatusUpdateTable>;
export type UpdateCaseStatusUpdateKysely = Updateable<CaseStatusUpdateTable>;

const caseStatisticTableDefinition = {
  docketNumber: DEFAULT as string,
  irsDeficiencyAmount: DEFAULT as string,
  irsTotalPenalties: DEFAULT as string,
  statisticId: DEFAULT as string,
  year: DEFAULT as number | null | undefined,
  yearOrPeriod: DEFAULT as string | null | undefined,
  determinationDeficiencyAmount: DEFAULT as string | null | undefined,
  determinationTotalPenalties: DEFAULT as string | null | undefined,
  lastDateOfPeriod: DEFAULT as Date | null | undefined,
  updatedAt: DEFAULT as Date,
};

export type CaseStatisticTable = typeof caseStatisticTableDefinition;

export const DW_CASE_STATISTIC_COLUMNS = Object.keys(
  caseStatisticTableDefinition,
) as Array<keyof CaseStatisticTable>;

export type CaseStatisticKysely = Selectable<CaseStatisticTable>;
export type NewCaseStatisticKysely = Insertable<CaseStatisticTable>;
export type UpdateCaseStatisticKysely = Updateable<CaseStatisticTable>;

const statisticPenaltyTableDefinition = {
  statisticId: DEFAULT as string,
  name: DEFAULT as string,
  penaltyAmount: DEFAULT as string,
  penaltyId: DEFAULT as string,
  penaltyType: DEFAULT as string,
  updatedAt: DEFAULT as Date,
};

export type StatisticPenaltyTable = typeof statisticPenaltyTableDefinition;

export const DW_STATISTIC_PENALTY_COLUMNS = Object.keys(
  statisticPenaltyTableDefinition,
) as Array<keyof StatisticPenaltyTable>;

export type StatisticPenaltyKysely = Selectable<StatisticPenaltyTable>;
export type NewStatisticPenaltyKysely = Insertable<StatisticPenaltyTable>;
export type UpdateStatisticPenaltyKysely = Updateable<StatisticPenaltyTable>;

const userCaseNoteTableDefinition = {
  docketNumber: DEFAULT as string,
  userId: DEFAULT as string,
  notes: DEFAULT as string | undefined,
};

export type UserCaseNoteTable = typeof userCaseNoteTableDefinition;

export const DW_USER_CASE_NOTE_COLUMNS = Object.keys(
  userCaseNoteTableDefinition,
) as Array<keyof UserCaseNoteTable>;

export type UserCaseNoteKysely = Selectable<UserCaseNoteTable>;
export type NewUserCaseNoteKysely = Insertable<UserCaseNoteTable>;
export type UpdateUserCaseNoteKysely = Updateable<UserCaseNoteTable>;

// TODO: This is just a stub to get things out of Open Search and into Postgres
const docketEntryTableDefinition = {
  createdAt: DEFAULT as Date,
  docketEntryId: DEFAULT as string,
  docketNumber: DEFAULT as string,
  documentTitle: DEFAULT as string,
  documentType: DEFAULT as string,
  eventCode: DEFAULT as string,
  filingDate: DEFAULT as Date,
  isLegacyServed: DEFAULT as boolean,
  pending: DEFAULT as boolean,
  receivedAt: DEFAULT as Date,
  servedAt: DEFAULT as Date | null,
  isStricken: DEFAULT as boolean | null,
  judge: DEFAULT as string | null,
  signedJudgeName: DEFAULT as string | null,
  isSealed: DEFAULT as boolean | null,
  sealedTo: DEFAULT as string | undefined,
  numberOfPages: DEFAULT as number | undefined,
};

export type DocketEntryTable = typeof docketEntryTableDefinition;

export const DW_DOCKET_ENTRY_COLUMNS = Object.keys(
  docketEntryTableDefinition,
) as Array<keyof DocketEntryTable>;

export type DocketEntryKysely = Selectable<DocketEntryTable>;
export type NewDocketEntryKysely = Insertable<DocketEntryTable>;
export type UpdateDocketEntryKysely = Updateable<DocketEntryTable>;

interface DatabaseSchemaType {
  dwCase: DatabaseTableMetadata<CaseTable>;
  dwCaseCorrespondence: DatabaseTableMetadata<CaseCorrespondenceTable>;
  dwCaseDeadline: DatabaseTableMetadata<CaseDeadlineTable>;
  dwCaseStatistic: DatabaseTableMetadata<CaseStatisticTable>;
  dwCaseStatusUpdate: DatabaseTableMetadata<CaseStatusUpdateTable>;
  dwCaseWorksheet: DatabaseTableMetadata<CaseWorksheetTable>;
  dwDocketEntry: DatabaseTableMetadata<DocketEntryTable>;
  dwMessage: DatabaseTableMetadata<MessageTable>;
  dwPetitionerOnCase: DatabaseTableMetadata<PetitionerOnCaseTable>;
  dwStatisticPenalty: DatabaseTableMetadata<StatisticPenaltyTable>;
  dwUserCaseNote: DatabaseTableMetadata<UserCaseNoteTable>;
  dwWorkItem: DatabaseTableMetadata<WorkItemTable>;
}

type DatabaseTableMetadata<TTable> = {
  table: TTable;
  columns: string[];
  filterBeforeSendingThroughQueue?: (rawResult) => {};
  indexInOpenSearch?: ({
    message,
  }: {
    message: OpenSearchSyncMessage;
  }) => Promise<void>;
};

export const DatabaseSchema: DatabaseSchemaType = {
  dwCase: {
    table: DEFAULT as CaseTable,
    columns: DW_CASE_COLUMNS,
    filterBeforeSendingThroughQueue: filterCaseBeforeSendingThroughQueue,
    indexInOpenSearch: openSearchIndexCase,
  },
  dwCaseCorrespondence: {
    table: DEFAULT as CaseCorrespondenceTable,
    columns: DW_CASE_CORRESPONDENCE_COLUMNS,
  },
  dwCaseDeadline: {
    table: DEFAULT as CaseDeadlineTable,
    columns: DW_CASE_DEADLINE_COLUMNS,
  },
  dwCaseStatistic: {
    table: DEFAULT as CaseStatisticTable,
    columns: DW_CASE_STATISTIC_COLUMNS,
  },
  dwCaseStatusUpdate: {
    table: DEFAULT as CaseStatusUpdateTable,
    columns: DW_CASE_STATUS_UPDATES_COLUMNS,
  },
  dwCaseWorksheet: {
    table: DEFAULT as CaseWorksheetTable,
    columns: DW_CASE_WORKSHEET_COLUMNS,
  },
  dwDocketEntry: {
    table: DEFAULT as DocketEntryTable,
    columns: DW_DOCKET_ENTRY_COLUMNS,
  },
  dwMessage: {
    table: DEFAULT as MessageTable,
    columns: DW_MESSAGE_COLUMNS,
  },
  dwPetitionerOnCase: {
    table: DEFAULT as PetitionerOnCaseTable,
    columns: DW_PETITIONERS_ON_CASE_COLUMNS,
  },
  dwStatisticPenalty: {
    table: DEFAULT as StatisticPenaltyTable,
    columns: DW_STATISTIC_PENALTY_COLUMNS,
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
