import { Selectable, Insertable, Updateable, ColumnType } from 'kysely';

const DEFAULT = {};

export const caseTableDefinition = {
  associatedJudge: DEFAULT as string | undefined,
  associatedJudgeId: DEFAULT as string | undefined,
  automaticBlocked: DEFAULT as boolean | undefined,
  automaticBlockedDate: DEFAULT as Date | null,
  automaticBlockedReason: DEFAULT as string | undefined,
  blocked: DEFAULT as boolean | undefined,
  blockedDate: DEFAULT as Date | null,
  blockedReason: DEFAULT as string | undefined,
  caption: DEFAULT as string,
  caseNote: DEFAULT as string | undefined,
  caseType: DEFAULT as string,
  closedDate: DEFAULT as Date | null,
  createdAt: DEFAULT as Date,
  damages: DEFAULT as number | undefined,
  docketNumber: DEFAULT as string,
  docketNumberSuffix: DEFAULT as string | undefined,
  filingType: DEFAULT as string | undefined,
  hasPendingItems: DEFAULT as boolean | undefined,
  hasVerifiedIrsNotice: DEFAULT as boolean | undefined,
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

export const caseStatusUpdateTableDefinition = {
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
