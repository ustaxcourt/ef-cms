import { CaseStatusChange } from '@shared/business/entities/cases/Case';
import { RawStatistic } from '@shared/business/entities/Statistic';
import { Selectable, Insertable, Updateable, ColumnType } from 'kysely';

const DEFAULT = {};

// Our semantics around undefined and null are currently inconsistent due to the Dynamo to Postgres transition.
// Undefined in a Dynamo record update  = "will overwrite so key no longer exists."
// Undefined in a Postgres row update = "won't overwrite and will leave as is." So we sometimes need null to say, "No, actually overwrite this!"
// After the transition to Postgres is complete, we should clean this up and be more consistent
export const caseTableDefinition = {
  associatedJudge: DEFAULT as string | null,
  associatedJudgeId: DEFAULT as string | null,
  automaticBlocked: DEFAULT as boolean | null,
  automaticBlockedDate: DEFAULT as Date | null,
  automaticBlockedReason: DEFAULT as string | null,
  blocked: DEFAULT as boolean | null,
  blockedDate: DEFAULT as Date | null,
  blockedReason: DEFAULT as string | null,
  caption: DEFAULT as string,
  caseNote: DEFAULT as string | null,
  caseStatusHistory: DEFAULT as ColumnType<CaseStatusChange[], string, string>,
  caseType: DEFAULT as string,
  closedDate: DEFAULT as Date | null,
  createdAt: DEFAULT as Date,
  damages: DEFAULT as number | null,
  docketNumber: DEFAULT as string,
  docketNumberSuffix: DEFAULT as string | null,
  filingType: DEFAULT as string | null,
  hasPendingItems: DEFAULT as boolean | null,
  hasVerifiedIrsNotice: DEFAULT as boolean | null,
  highPriority: DEFAULT as boolean | null,
  highPriorityReason: DEFAULT as string | null,
  initialCaption: DEFAULT as string | null,
  initialDocketNumberSuffix: DEFAULT as string | null,
  irsNoticeDate: DEFAULT as Date | null,
  isPaper: DEFAULT as boolean | null,
  isSealed: DEFAULT as boolean | null,
  leadDocketNumber: DEFAULT as string | null,
  litigationCosts: DEFAULT as number | null,
  mailingDate: DEFAULT as string | null,
  noticeOfAttachments: DEFAULT as boolean | null,
  noticeOfTrialDate: DEFAULT as Date | null,
  orderDesignatingPlaceOfTrial: DEFAULT as boolean | null,
  orderForAmendedPetition: DEFAULT as boolean | null,
  orderForAmendedPetitionAndFilingFee: DEFAULT as boolean | null,
  orderForCds: DEFAULT as boolean | null,
  orderForFilingFee: DEFAULT as boolean | null,
  orderForRatification: DEFAULT as boolean | null,
  orderToShowCause: DEFAULT as boolean | null,
  partyType: DEFAULT as string,
  petitioners: DEFAULT as ColumnType<TPetitioner[], string, string>,
  petitionPaymentDate: DEFAULT as Date | null,
  petitionPaymentMethod: DEFAULT as string | null,
  petitionPaymentStatus: DEFAULT as string,
  petitionPaymentWaivedDate: DEFAULT as Date | null,
  preferredTrialCity: DEFAULT as string | null,
  procedureType: DEFAULT as string,
  qcCompleteForTrial: DEFAULT as
    | ColumnType<{ trialSessionId: string }, string, string>
    | undefined,
  receivedAt: DEFAULT as Date,
  sealedDate: DEFAULT as Date | null,
  sortableDocketNumber: 0 as number,
  statistics: DEFAULT as ColumnType<RawStatistic[], string, string>,
  status: DEFAULT as string,
  trialDate: DEFAULT as Date | null,
  trialLocation: DEFAULT as string | null,
  trialSessionId: DEFAULT as string | null,
  trialTime: DEFAULT as string | null,
  useSameAsPrimary: DEFAULT as boolean | null,
};

export type CaseTable = typeof caseTableDefinition;

export const DW_CASE_COLUMNS = Object.keys(caseTableDefinition) as Array<
  keyof CaseTable
>;

export type CaseKysely = Selectable<CaseTable>;
export type NewCaseKysely = Insertable<CaseTable>;
export type UpdateCaseKysely = Updateable<CaseTable>;
