import { ColumnType, Insertable, Selectable, Updateable } from 'kysely';

export interface Database {
  dwCase: CaseTable;
  dwCaseStatistic: CaseStatisticTable;
  dwCaseStatusUpdate: CaseStatusUpdateTable;
  dwDocketEntry: DocketEntryTable;
  dwMessage: MessageTable;
  dwPetitionerOnCase: PetitionerOnCaseTable;
  dwPractitionerOnCase: PractitionerOnCaseTable;
  dwStatisticPenalty: StatisticPenaltyTable;
  dwUserCaseNote: UserCaseNoteTable;
  dwWorkItem: WorkItemTable;
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
  associatedJudge?: string;
  associatedJudgeId?: string;
  automaticBlocked?: boolean;
  automaticBlockedDate?: Date | null;
  automaticBlockedReason?: string;
  blocked?: boolean;
  blockedDate?: Date | null;
  blockedReason?: string;
  canAllowDocumentService?: boolean;
  canAllowPrintableDocketRecord?: boolean;
  canDojPractitionersRepresentParty?: boolean;
  caption: string;
  caseNote?: string;
  caseType: string;
  closedDate?: Date | null;
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
  irsNoticeDate?: Date | null;
  isPaper?: boolean | null;
  isSealed?: boolean | null;
  judgeUserId?: string;
  leadDocketNumber?: string | null;
  litigationCosts?: number;
  mailingDate?: string;
  noticeOfAttachments?: boolean;
  noticeOfTrialDate?: Date | null;
  orderDesignatingPlaceOfTrial?: boolean;
  orderForAmendedPetition?: boolean;
  orderForAmendedPetitionAndFilingFee?: boolean;
  orderForCds?: boolean;
  orderForFilingFee?: boolean;
  orderForRatification?: boolean;
  orderToShowCause?: boolean;
  partyType: string;
  petitionPaymentDate?: Date | null;
  petitionPaymentMethod?: string;
  petitionPaymentStatus: string;
  petitionPaymentWaivedDate?: Date | null;
  preferredTrialCity?: string;
  procedureType: string;
  qcCompleteForTrial?: Record<string, any>; // needed
  receivedAt: Date;
  sealedDate?: Date | null;
  sortableDocketNumber: number;
  status: string;
  trialDate?: Date | null;
  trialLocation?: string | null;
  trialSessionId?: string | null;
  trialTime?: string | null;
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

export interface PetitionerOnCaseTable {
  additionalName?: string;
  contactType: string;
  docketNumber: string;
  hasConsentedToEService?: boolean;
  hasEAccess?: boolean;
  inCareOf?: string;
  isAddressSealed: boolean;
  paperPetitionEmail?: string;
  placeOfLegalResidence?: string;
  sealedAndUnavailable?: boolean;
  secondaryName?: string;
  serviceIndicator?: string;
  title?: string;
  orderOnCase: number;

  // Maybe break this out into a contact table down the road
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
  state?: string;
}

export type PetitionerOnCaseKysely = Selectable<PetitionerOnCaseTable>;
export type NewUPetitionerOnCaseKysely = Insertable<PetitionerOnCaseTable>;
export type UpdatePetitionerOnCaseKysely = Updateable<PetitionerOnCaseTable>;

export interface CaseStatusUpdateTable {
  changedBy: string; // TODO: This should almost certainly be a foreign key to a user (with a user for System), but it isn't set up that way. Probably best to wait until Users are migrated over?
  date: Date;
  docketNumber: string;
  updatedCaseStatus: string;
}

export type CaseStatusUpdateKysely = Selectable<CaseStatusUpdateTable>;
export type NewCaseStatusUpdateKysely = Insertable<CaseStatusUpdateTable>;
export type UpdateCaseStatusUpdateKysely = Updateable<CaseStatusUpdateTable>;

export interface CaseStatisticTable {
  docketNumber: string;
  irsDeficiencyAmount: string;
  irsTotalPenalties: string;
  statisticId: string;
  year?: number | null;
  yearOrPeriod: string;
  determinationDeficiencyAmount?: string | null;
  determinationTotalPenalties?: string | null;
  lastDateOfPeriod?: Date | null;
}

export type CaseStatisticKysely = Selectable<CaseStatisticTable>;
export type NewCaseStatisticKysely = Insertable<CaseStatisticTable>;
export type UpdateCaseStatisticKysely = Updateable<CaseStatisticTable>;

export interface StatisticPenaltyTable {
  statisticId: string;
  name: string;
  penaltyAmount: string;
  penaltyId: string;
  penaltyType: string;
}

export type StatisticPenaltyKysely = Selectable<StatisticPenaltyTable>;
export type NewStatisticPenaltyKysely = Insertable<StatisticPenaltyTable>;
export type UpdateStatisticPenaltyKysely = Updateable<StatisticPenaltyTable>;
export interface UserCaseNoteTable {
  docketNumber: string;
  userId: string;
  notes?: string;
}

export type UserCaseNoteKysely = Selectable<UserCaseNoteTable>;
export type NewUserCaseNoteKysely = Insertable<UserCaseNoteTable>;
export type UpdateUserCaseNoteKysely = Updateable<UserCaseNoteTable>;

// TODO: This is just a stub to get things out of Open Search and into Postgres
export interface PractitionerOnCaseTable {
  docketNumber: string;
  userId: string;
  email: string;
}

export type PractitionerOnCaseKysely = Selectable<PractitionerOnCaseTable>;
export type NewPractitionerOnCaseKysely = Insertable<PractitionerOnCaseTable>;
export type UpdatePractitionerOnCaseKysely =
  Updateable<PractitionerOnCaseTable>;

// TODO: This is just a stub to get things out of Open Search and into Postgres
export interface DocketEntryTable {
  createdAt: Date;
  docketEntryId: string;
  docketNumber: string;
  documentTitle: string;
  documentType: string;
  eventCode: string;
  filingDate: Date;
  isLegacyServed: boolean;
  pending: boolean;
  receivedAt: Date;
  servedAt: Date | null;
  isStricken: boolean | null;
  judge: string | null;
  signedJudgeName: string | null;
  isSealed: boolean | null;
  sealedTo?: string;
  numberOfPages?: number;
}

export type DocketEntryKysely = Selectable<DocketEntryTable>;
export type NewDocketEntryKysely = Insertable<DocketEntryTable>;
export type UpdateDocketEntryKysely = Updateable<DocketEntryTable>;
