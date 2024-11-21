import { ColumnType, Insertable, Selectable, Updateable } from 'kysely';

export interface Database {
  dwCase: CaseTable;
  dwMessage: MessageTable;
  dwWorkItem: WorkItemTable;
  dwUser: UserTable;
  dwUserCase: UserCaseTable;
  dwCaseStatusUpdate: CaseStatusUpdateTable;
  dwCaseStatistics: CaseStatisticsTable;
}

export interface MessageTable {
  attachments?: ColumnType<{ documentId: string }[], string, string>;
  completedAt?: Date;
  completedBy?: string;
  completedBySection?: string;
  completedByUserId?: string;
  completedMessage?: string;
  createdAt: Date;
  docketNumber: string;
  from: string;
  fromSection: string;
  fromUserId: string;
  isCompleted: boolean;
  isRead: boolean;
  isRepliedTo: boolean;
  leadDocketNumber?: string;
  message: string;
  messageId: string;
  parentMessageId: string;
  subject: string;
  to: string;
  toSection: string;
  toUserId: string;
}

export type MessageKysely = Selectable<MessageTable>;
export type NewMessageKysely = Insertable<MessageTable>;
export type UpdateMessageKysely = Updateable<MessageTable>;

export interface CaseTable {
  // archivedCorrespondences?: any[];
  // archivedDocketEntries?: RawDocketEntry[];
  // consolidatedCases: RawConsolidatedCaseSummary[] = []
  // irsPractitioners?: any[];
  // privatePractitioners?: any[];
  associatedJudge?: string;
  associatedJudgeId?: string;
  automaticBlocked?: boolean;
  automaticBlockedDate?: Date; // do we need this and blockedDate?
  automaticBlockedReason?: string;
  blocked?: boolean;
  blockedDate?: Date;
  blockedReason?: string;
  canAllowDocumentService?: boolean;
  canAllowPrintableDocketRecord?: boolean;
  canDojPractitionersRepresentParty?: boolean;
  caption: string;
  caseNote?: string;
  caseType: string;
  closedDate?: Date;
  createdAt: Date;
  damages?: number;
  docketNumber: string;
  docketNumberSuffix?: string;
  filingType?: string;
  hasPendingItems?: boolean;
  hasVerifiedIrsNotice?: boolean;
  hearings?: any[];
  highPriority?: boolean;
  highPriorityReason?: string;
  initialCaption?: string;
  initialDocketNumberSuffix?: string;
  irsNoticeDate?: Date;
  isPaper?: boolean;
  isSealed?: boolean;
  judgeUserId?: string;
  leadDocketNumber?: string;
  litigationCosts?: number;
  mailingDate?: string; // this seems like a display field more than an actual date
  noticeOfAttachments?: boolean;
  noticeOfTrialDate?: Date;
  orderDesignatingPlaceOfTrial?: boolean;
  orderForAmendedPetition?: boolean;
  orderForAmendedPetitionAndFilingFee?: boolean;
  orderForCds?: boolean;
  orderForFilingFee?: boolean;
  orderForRatification?: boolean;
  orderToShowCause?: boolean;
  partyType: string;
  petitionPaymentDate?: Date;
  petitionPaymentMethod?: string;
  petitionPaymentStatus: string;
  petitionPaymentWaivedDate?: Date;
  preferredTrialCity?: string;
  procedureType: string;
  qcCompleteForTrial?: Record<string, any>; // needed
  receivedAt: Date;
  sealedDate?: Date;
  sortableDocketNumber: number;
  statistics?: any[];
  status: string;
  trialDate?: Date;
  trialLocation?: string;
  trialSessionId?: string;
  trialTime?: string;
  useSameAsPrimary?: boolean;
}

export type CaseKysely = Selectable<CaseTable>;
export type NewCaseKysely = Insertable<CaseTable>;
export type UpdateCaseKysely = Updateable<CaseTable>;

export interface WorkItemTable {
  assigneeId?: string;
  assigneeName?: string;
  associatedJudge: string;
  associatedJudgeId?: string;
  caseIsInProgress?: boolean;
  completedAt?: Date;
  completedBy?: string;
  completedByUserId?: string;
  completedMessage?: string;
  createdAt: Date;
  docketEntry: any;
  docketNumber: string;
  hideFromPendingMessages?: boolean;
  highPriority?: boolean;
  inProgress?: boolean;
  isInitializeCase?: boolean;
  isRead?: boolean;
  section: string;
  sentBy: string;
  sentBySection?: string;
  sentByUserId?: string;
  updatedAt: Date;
  workItemId: string;
}

export type WorkItemKysely = Selectable<WorkItemTable>;
export type NewWorkItemKysely = Insertable<WorkItemTable>;
export type UpdateWorkItemKysely = Updateable<WorkItemTable>;

export interface UserTable {
  address1: string;
  address2?: string;
  address3?: string;
  city: string;
  contactId: string;
  country?: string;
  countryType: string;
  email?: string;
  name: string;
  phone: string;
  postalCode: string;
  state: string;
}

export interface UserCaseTable {
  // caseUserId: string;
  additionalName: string;
  contactId: string;
  contactType: string;
  docketNumber: string;
  hasConsentedToEService?: boolean;
  hasEAccess?: boolean;
  inCareOf?: string;
  isAddressSealed: boolean;
  paperPetitionEmail?: string;
  placeOfLegalResidence?: string;
  sealedAndUnavailable?: boolean;
  secondaryName?: string; // how is this different from additional name?
  serviceIndicator?: string;
  title?: string;
}

export type UserKysely = Selectable<UserTable>;
export type NewUserKysely = Insertable<UserTable>;
export type UpdateUserKysely = Updateable<UserTable>;

export type UserCaseKysely = Selectable<UserCaseTable>;
export type NewUserCaseKysely = Insertable<UserCaseTable>;
export type UpdateUserCaseKysely = Updateable<UserCaseTable>;

export interface CaseStatusUpdateTable {
  changedBy: string; // TODO: This should almost certainly be a foreign key to a user (with a user for System), but it isn't set up that way. Probably best to wait until Users are migrated over?
  date: Date;
  docketNumber: string;
  updatedCaseStatus: string;
}

export type CaseStatusUpdateKysely = Selectable<CaseStatusUpdateTable>;
export type NewCaseStatusUpdateKysely = Insertable<CaseStatusUpdateTable>;
export type UpdateCaseStatusUpdateKysely = Updateable<CaseStatusUpdateTable>;

export interface CaseStatisticsTable {
  docketNumber: string;
  irsDeficiencyAmount: number;
  irsTotalPenalties: number;
  statisticId: string;
  year: number;
  yearOrPeriod: string;
  // TODO 10502: finish filling out
}

export type CaseStatisticsKysely = Selectable<CaseStatisticsTable>;
export type NewCaseStatisticsKysely = Insertable<CaseStatisticsTable>;
export type UpdateCaseStatisticsKysely = Updateable<CaseStatisticsTable>;
