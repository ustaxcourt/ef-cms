import { ColumnType, Insertable, Selectable, Updateable } from 'kysely';

const messageTableDefinition = {
  attachments: {} as
    | ColumnType<{ documentId: string }[], string, string>
    | undefined,
  completedAt: {} as Date | undefined,
  completedBy: {} as string | undefined,
  completedBySection: {} as string | undefined,
  completedByUserId: {} as string | undefined,
  completedMessage: {} as string | undefined,
  createdAt: {} as Date,
  docketNumber: {} as string,
  from: {} as string,
  fromSection: {} as string,
  fromUserId: {} as string,
  isCompleted: {} as boolean,
  isRead: {} as boolean,
  isRepliedTo: {} as boolean,
  message: {} as string,
  messageId: {} as string,
  parentMessageId: {} as string,
  subject: {} as string,
  to: {} as string,
  toSection: {} as string,
  toUserId: {} as string,
};

export type MessageTable = typeof messageTableDefinition;

export const DW_MESSAGE_COLUMNS = Object.keys(messageTableDefinition) as Array<
  keyof MessageTable
>;

export type MessageKysely = Selectable<MessageTable>;
export type NewMessageKysely = Insertable<MessageTable>;
export type UpdateMessageKysely = Updateable<MessageTable>;

const caseTableDefinition = {
  associatedJudge: {} as string | undefined,
  associatedJudgeId: {} as string | undefined,
  automaticBlocked: {} as boolean | undefined,
  automaticBlockedDate: {} as Date | null,
  automaticBlockedReason: {} as string | undefined,
  blocked: {} as boolean | undefined,
  blockedDate: {} as Date | null,
  blockedReason: {} as string | undefined,
  canAllowDocumentService: {} as boolean | undefined,
  canAllowPrintableDocketRecord: {} as boolean | undefined,
  canDojPractitionersRepresentParty: {} as boolean | undefined,
  caption: {} as string,
  caseNote: {} as string | undefined,
  caseType: {} as string,
  closedDate: {} as Date | null,
  createdAt: {} as Date,
  damages: {} as number | undefined,
  docketNumber: {} as string,
  docketNumberSuffix: {} as string | undefined,
  docketEntries: {} as
    | ColumnType<
        { docketEntryId: string; docketNumber: string }[],
        string,
        string
      >
    | undefined,
  filingType: {} as string | undefined,
  hasPendingItems: {} as boolean | undefined,
  hasVerifiedIrsNotice: {} as boolean | undefined,
  hearings: {} as
    | ColumnType<{ trialSessionId: string }[], string, string>
    | undefined,
  highPriority: {} as boolean | undefined,
  highPriorityReason: {} as string | undefined,
  initialCaption: {} as string | undefined,
  initialDocketNumberSuffix: {} as string | undefined,
  irsNoticeDate: {} as Date | null,
  isPaper: {} as boolean | null | undefined,
  isSealed: {} as boolean | null | undefined,
  judgeUserId: {} as string | undefined,
  leadDocketNumber: {} as string | null | undefined,
  litigationCosts: {} as number | undefined,
  mailingDate: {} as string | undefined,
  noticeOfAttachments: {} as boolean | undefined,
  noticeOfTrialDate: {} as Date | null,
  orderDesignatingPlaceOfTrial: {} as boolean | undefined,
  orderForAmendedPetition: {} as boolean | undefined,
  orderForAmendedPetitionAndFilingFee: {} as boolean | undefined,
  orderForCds: {} as boolean | undefined,
  orderForFilingFee: {} as boolean | undefined,
  orderForRatification: {} as boolean | undefined,
  orderToShowCause: {} as boolean | undefined,
  partyType: {} as string,
  petitionPaymentDate: {} as Date | null,
  petitionPaymentMethod: {} as string | undefined,
  petitionPaymentStatus: {} as string,
  petitionPaymentWaivedDate: {} as Date | null,
  preferredTrialCity: {} as string | undefined,
  procedureType: {} as string,
  qcCompleteForTrial: {} as
    | ColumnType<{ trialSessionId: string }, string, string>
    | undefined,
  receivedAt: {} as Date,
  sealedDate: {} as Date | null,
  sortableDocketNumber: 0 as number,
  status: {} as string,
  trialDate: {} as Date | null,
  trialLocation: {} as string | null,
  trialSessionId: {} as string | null,
  trialTime: {} as string | null,
  useSameAsPrimary: {} as boolean | undefined,
};

export type CaseTable = typeof caseTableDefinition;

export const DW_CASE_COLUMNS = Object.keys(caseTableDefinition) as Array<
  keyof CaseTable
>;

export type CaseKysely = Selectable<CaseTable>;
export type NewCaseKysely = Insertable<CaseTable>;
export type UpdateCaseKysely = Updateable<CaseTable>;

const caseCorrespondenceTableDefinition = {
  archived: {} as boolean | undefined,
  correspondenceId: {} as string,
  documentTitle: {} as string,
  filedBy: {} as string | undefined,
  filingDate: {} as Date,
  userId: {} as string,
  docketNumber: {} as string,
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
  associatedJudge: {} as string,
  associatedJudgeId: {} as string | undefined,
  caseDeadlineId: {} as string,
  createdAt: {} as Date,
  deadlineDate: {} as Date,
  description: {} as string,
  docketNumber: {} as string,
  sortableDocketNumber: {} as number,
};

export type CaseDeadlineTable = typeof caseDeadlineTableDefinition;

export const DW_CASE_DEADLINE_COLUMNS = Object.keys(
  caseDeadlineTableDefinition,
) as Array<keyof CaseDeadlineTable>;

export type CaseDeadlineKysely = Selectable<CaseDeadlineTable>;
export type NewCaseDeadlineKysely = Insertable<CaseDeadlineTable>;
export type UpdateCaseDeadlineKysely = Updateable<CaseDeadlineTable>;

const caseWorksheetTableDefinition = {
  docketNumber: {} as string,
  finalBriefDueDate: {} as Date | null | undefined,
  primaryIssue: {} as string | undefined,
  statusOfMatter: {} as string | undefined,
  judgeUserId: {} as string | undefined,
};

export type CaseWorksheetTable = typeof caseWorksheetTableDefinition;

export const DW_CASE_WORKSHEET_COLUMNS = Object.keys(
  caseWorksheetTableDefinition,
) as Array<keyof CaseWorksheetTable>;

export type CaseWorksheetKysely = Selectable<CaseWorksheetTable>;
export type NewCaseWorksheetKysely = Insertable<CaseWorksheetTable>;
export type UpdateCaseWorksheetKysely = Updateable<CaseWorksheetTable>;

const workItemTableDefinition = {
  assigneeId: {} as string | undefined,
  assigneeName: {} as string | undefined,
  caseIsInProgress: {} as boolean | undefined,
  completedAt: {} as Date | undefined,
  completedBy: {} as string | undefined,
  completedByUserId: {} as string | undefined,
  completedMessage: {} as string | undefined,
  createdAt: {} as Date,
  docketEntry: {} as any,
  docketNumber: {} as string,
  inProgress: {} as boolean | undefined,
  isRead: {} as boolean | undefined,
  section: {} as string,
  sentBy: {} as string,
  sentBySection: {} as string | undefined,
  sentByUserId: {} as string | undefined,
  updatedAt: {} as Date,
  workItemId: {} as string,
} as const;

export type WorkItemTable = typeof workItemTableDefinition;

export const DW_WORK_ITEM_COLUMNS = Object.keys(
  workItemTableDefinition,
) as Array<keyof WorkItemTable>;

export type WorkItemKysely = Selectable<WorkItemTable>;
export type NewWorkItemKysely = Insertable<WorkItemTable>;
export type UpdateWorkItemKysely = Updateable<WorkItemTable>;

const petitionerOnCaseTableDefinition = {
  additionalName: {} as string | undefined,
  contactType: {} as string,
  docketNumber: {} as string,
  hasConsentedToElectronicService: {} as boolean | undefined,
  hasElectronicAccess: {} as boolean | undefined,
  inCareOf: {} as string | undefined,
  isAddressSealed: {} as boolean,
  paperPetitionEmail: {} as string | undefined,
  placeOfLegalResidence: {} as string | undefined,
  sealedAndUnavailable: {} as boolean | undefined,
  secondaryName: {} as string | undefined,
  serviceIndicator: {} as string | undefined,
  title: {} as string | undefined,
  orderOnCase: {} as number,

  // Maybe break this out into a contact table down the road
  address1: {} as string,
  address2: {} as string | undefined,
  address3: {} as string | undefined,
  city: {} as string,
  contactId: {} as string,
  country: {} as string | undefined,
  countryType: {} as string,
  email: {} as string | undefined,
  name: {} as string,
  phone: {} as string,
  postalCode: {} as string,
  state: {} as string | undefined,
};

export type PetitionerOnCaseTable = typeof petitionerOnCaseTableDefinition;

export const DW_PETITIONERS_ON_CASE_COLUMNS = Object.keys(
  petitionerOnCaseTableDefinition,
) as Array<keyof PetitionerOnCaseTable>;

export type PetitionerOnCaseKysely = Selectable<PetitionerOnCaseTable>;
export type NewPetitionerOnCaseKysely = Insertable<PetitionerOnCaseTable>;
export type UpdatePetitionerOnCaseKysely = Updateable<PetitionerOnCaseTable>;

const caseStatusUpdateTableDefinition = {
  statusUpdateId: {} as string,
  changedBy: {} as string,
  date: {} as Date,
  docketNumber: {} as string,
  updatedCaseStatus: {} as string,
};

export type CaseStatusUpdateTable = typeof caseStatusUpdateTableDefinition;

export const DW_CASE_STATUS_UPDATES_COLUMNS = Object.keys(
  caseStatusUpdateTableDefinition,
) as Array<keyof CaseStatusUpdateTable>;

export type CaseStatusUpdateKysely = Selectable<CaseStatusUpdateTable>;
export type NewCaseStatusUpdateKysely = Insertable<CaseStatusUpdateTable>;
export type UpdateCaseStatusUpdateKysely = Updateable<CaseStatusUpdateTable>;

const caseStatisticTableDefinition = {
  docketNumber: {} as string,
  irsDeficiencyAmount: {} as string,
  irsTotalPenalties: {} as string,
  statisticId: {} as string,
  year: {} as number | null | undefined,
  yearOrPeriod: {} as string | null | undefined,
  determinationDeficiencyAmount: {} as string | null | undefined,
  determinationTotalPenalties: {} as string | null | undefined,
  lastDateOfPeriod: {} as Date | null | undefined,
  updatedAt: {} as Date,
};

export type CaseStatisticTable = typeof caseStatisticTableDefinition;

export const DW_CASE_STATISTIC_COLUMNS = Object.keys(
  caseStatisticTableDefinition,
) as Array<keyof CaseStatisticTable>;

export type CaseStatisticKysely = Selectable<CaseStatisticTable>;
export type NewCaseStatisticKysely = Insertable<CaseStatisticTable>;
export type UpdateCaseStatisticKysely = Updateable<CaseStatisticTable>;

const statisticPenaltyTableDefinition = {
  statisticId: {} as string,
  name: {} as string,
  penaltyAmount: {} as string,
  penaltyId: {} as string,
  penaltyType: {} as string,
  updatedAt: {} as Date,
};

export type StatisticPenaltyTable = typeof statisticPenaltyTableDefinition;

export const DW_STATISTIC_PENALTY_COLUMNS = Object.keys(
  statisticPenaltyTableDefinition,
) as Array<keyof StatisticPenaltyTable>;

export type StatisticPenaltyKysely = Selectable<StatisticPenaltyTable>;
export type NewStatisticPenaltyKysely = Insertable<StatisticPenaltyTable>;
export type UpdateStatisticPenaltyKysely = Updateable<StatisticPenaltyTable>;

const userCaseNoteTableDefinition = {
  docketNumber: {} as string,
  userId: {} as string,
  notes: {} as string | undefined,
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
  createdAt: {} as Date,
  docketEntryId: {} as string,
  docketNumber: {} as string,
  documentTitle: {} as string,
  documentType: {} as string,
  eventCode: {} as string,
  filingDate: {} as Date,
  isLegacyServed: {} as boolean,
  pending: {} as boolean,
  receivedAt: {} as Date,
  servedAt: {} as Date | null,
  isStricken: {} as boolean | null,
  judge: {} as string | null,
  signedJudgeName: {} as string | null,
  isSealed: {} as boolean | null,
  sealedTo: {} as string | undefined,
  numberOfPages: {} as number | undefined,
};

export type DocketEntryTable = typeof docketEntryTableDefinition;

export const DW_DOCKET_ENTRY_COLUMNS = Object.keys(
  docketEntryTableDefinition,
) as Array<keyof DocketEntryTable>;

export type DocketEntryKysely = Selectable<DocketEntryTable>;
export type NewDocketEntryKysely = Insertable<DocketEntryTable>;
export type UpdateDocketEntryKysely = Updateable<DocketEntryTable>;

type DatabaseTableMetadata<TTable> = {
  table: TTable;
  columns: string[];
};

export const DatabaseSchema = {
  dwCase: { table: {} as CaseTable, columns: DW_CASE_COLUMNS },
  dwCaseCorrespondence: {
    table: {} as CaseCorrespondenceTable,
    columns: DW_CASE_CORRESPONDENCE_COLUMNS,
  },
  dwCaseDeadline: {
    table: {} as CaseDeadlineTable,
    columns: DW_CASE_DEADLINE_COLUMNS,
  },
  dwCaseStatistic: {
    table: {} as CaseStatisticTable,
    columns: DW_CASE_STATISTIC_COLUMNS,
  },
  dwCaseStatusUpdate: {
    table: {} as CaseStatusUpdateTable,
    columns: DW_CASE_STATUS_UPDATES_COLUMNS,
  },
  dwCaseWorksheet: {
    table: {} as CaseWorksheetTable,
    columns: DW_CASE_WORKSHEET_COLUMNS,
  },
  dwDocketEntry: {
    table: {} as DocketEntryTable,
    columns: DW_DOCKET_ENTRY_COLUMNS,
  },
  dwMessage: {
    table: {} as MessageTable,
    columns: DW_MESSAGE_COLUMNS,
  },
  dwPetitionerOnCase: {
    table: {} as PetitionerOnCaseTable,
    columns: DW_PETITIONERS_ON_CASE_COLUMNS,
  },
  dwStatisticPenalty: {
    table: {} as StatisticPenaltyTable,
    columns: DW_STATISTIC_PENALTY_COLUMNS,
  },
  dwUserCaseNote: {
    table: {} as UserCaseNoteTable,
    columns: DW_USER_CASE_NOTE_COLUMNS,
  },
  dwWorkItem: {
    table: {} as WorkItemTable,
    columns: DW_WORK_ITEM_COLUMNS,
  },
} as const satisfies Record<string, DatabaseTableMetadata<any>>;

type ExtractTable<T> = T extends { table: infer U } ? U : never;

export type Database = {
  [K in keyof typeof DatabaseSchema]: ExtractTable<(typeof DatabaseSchema)[K]>;
};
