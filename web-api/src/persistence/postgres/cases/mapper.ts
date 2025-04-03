import {
  CaseStatus,
  CaseType,
} from '@shared/business/entities/EntityConstants';
import {
  calculateDate,
  formatNow,
} from '@shared/business/utilities/DateHandler';
import { DatabaseSchema } from '@web-api/database-schema';
import { CaseKysely } from '@web-api/persistence/postgres/cases/schema';
import { DatabaseToAppCodeMapper } from '@web-api/persistence/postgres/utils/databaseToAppCodeMapper';

// Select the relevant RawCase fields from dwCase and map them correctly.
export const toKyselyNewCase = (rawCase: RawCase) => {
  return {
    associatedJudge: rawCase.associatedJudge,
    associatedJudgeId: rawCase.associatedJudgeId,
    automaticBlocked: rawCase.automaticBlocked,
    automaticBlockedDate: rawCase.automaticBlockedDate
      ? calculateDate({ dateString: rawCase.automaticBlockedDate })
      : null,
    automaticBlockedReason: rawCase.automaticBlockedReason || null,
    blocked: rawCase.blocked,
    blockedDate: rawCase.blockedDate
      ? calculateDate({ dateString: rawCase.blockedDate })
      : null,
    blockedReason: rawCase.blockedReason || null,
    caption: rawCase.caseCaption,
    caseNote: rawCase.caseNote,
    caseType: rawCase.caseType,
    closedDate: rawCase.closedDate
      ? calculateDate({ dateString: rawCase.closedDate })
      : null,
    createdAt: rawCase.createdAt
      ? calculateDate({ dateString: rawCase.createdAt })
      : calculateDate({ dateString: formatNow() }),
    damages: rawCase.damages,
    docketNumber: rawCase.docketNumber,
    docketNumberSuffix: rawCase.docketNumberSuffix || undefined,
    filingType: rawCase.filingType,
    hasPendingItems: rawCase.hasPendingItems,
    hasVerifiedIrsNotice: rawCase.hasVerifiedIrsNotice,
    highPriority: rawCase.highPriority,
    highPriorityReason: rawCase.highPriorityReason,
    initialCaption: rawCase.initialCaption,
    initialDocketNumberSuffix: rawCase.initialDocketNumberSuffix,
    irsNoticeDate: rawCase.irsNoticeDate
      ? calculateDate({ dateString: rawCase.irsNoticeDate })
      : null,
    isPaper: rawCase.isPaper,
    isSealed: rawCase.isSealed,
    leadDocketNumber: rawCase.leadDocketNumber || null,
    litigationCosts: rawCase.litigationCosts,
    mailingDate: rawCase.mailingDate,
    noticeOfAttachments: rawCase.noticeOfAttachments,
    noticeOfTrialDate: rawCase.noticeOfTrialDate
      ? calculateDate({ dateString: rawCase.noticeOfTrialDate })
      : null,
    orderDesignatingPlaceOfTrial: rawCase.orderDesignatingPlaceOfTrial,
    orderForAmendedPetition: rawCase.orderForAmendedPetition,
    orderForAmendedPetitionAndFilingFee:
      rawCase.orderForAmendedPetitionAndFilingFee,
    orderForCds: rawCase.orderForCds,
    orderForFilingFee: rawCase.orderForFilingFee,
    orderForRatification: rawCase.orderForRatification,
    orderToShowCause: rawCase.orderToShowCause,
    partyType: rawCase.partyType,
    petitionPaymentDate: rawCase.petitionPaymentDate
      ? calculateDate({ dateString: rawCase.petitionPaymentDate })
      : null,
    petitionPaymentMethod: rawCase.petitionPaymentMethod,
    petitionPaymentStatus: rawCase.petitionPaymentStatus,
    petitionPaymentWaivedDate: rawCase.petitionPaymentWaivedDate
      ? calculateDate({ dateString: rawCase.petitionPaymentWaivedDate })
      : null,
    preferredTrialCity: rawCase.preferredTrialCity,
    procedureType: rawCase.procedureType,
    qcCompleteForTrial: JSON.stringify(rawCase.qcCompleteForTrial),
    receivedAt: rawCase.receivedAt
      ? calculateDate({ dateString: rawCase.receivedAt })
      : calculateDate({ dateString: formatNow() }),
    // Is this what we want?
    sealedDate: rawCase.sealedDate
      ? calculateDate({ dateString: rawCase.sealedDate })
      : null,
    sortableDocketNumber: rawCase.sortableDocketNumber,
    status: rawCase.status,
    trialDate: rawCase.trialDate
      ? calculateDate({ dateString: rawCase.trialDate })
      : null,
    trialLocation: rawCase.trialLocation || null,
    trialSessionId: rawCase.trialSessionId || null,
    trialTime: rawCase.trialTime || null,
    useSameAsPrimary: rawCase.useSameAsPrimary,
  };
};

export function fromKyselyCase<T extends object>(record: T) {
  // Map for renaming keys from DB format to the desired RawCase format.
  const keyRenameMap = {
    caption: 'caseCaption',
  } as const;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dwCaseSchema = DatabaseSchema.dwCase.table;

  // Map for transforming values.
  const transformMap = {
    automaticBlockedDate: (
      value: typeof dwCaseSchema.automaticBlockedDate,
      _: Partial<CaseKysely>,
    ) => value?.toISOString(),
    blockedDate: (
      value: typeof dwCaseSchema.blockedDate,
      _: Partial<CaseKysely>,
    ) => value?.toISOString(),
    caseType: (value: string, _: Partial<CaseKysely>) => value as CaseType,
    closedDate: (
      value: typeof dwCaseSchema.closedDate,
      _: Partial<CaseKysely>,
    ) => value?.toISOString(),
    createdAt: (value: typeof dwCaseSchema.createdAt, _: Partial<CaseKysely>) =>
      value.toISOString(),
    irsNoticeDate: (
      value: typeof dwCaseSchema.irsNoticeDate,
      _: Partial<CaseKysely>,
    ) => value?.toISOString(),
    noticeOfTrialDate: (
      value: typeof dwCaseSchema.noticeOfTrialDate,
      _: Partial<CaseKysely>,
    ) => value?.toISOString(),
    petitioners: (value?: any[], _?: Partial<CaseKysely>) =>
      value ? value.map(p => ({ ...p, state: p.state || null })) : [], // petitioner state needs to be null rather than undefined
    petitionPaymentDate: (
      value: typeof dwCaseSchema.petitionPaymentDate,
      _: Partial<CaseKysely>,
    ) => value?.toISOString(),
    petitionPaymentWaivedDate: (
      value: typeof dwCaseSchema.petitionPaymentWaivedDate,
      _: Partial<CaseKysely>,
    ) => value?.toISOString(),
    receivedAt: (
      value: typeof dwCaseSchema.receivedAt,
      _: Partial<CaseKysely>,
    ) => value.toISOString(),
    sealedDate: (
      value: typeof dwCaseSchema.sealedDate,
      _: Partial<CaseKysely>,
    ) => value?.toISOString(),
    status: (value: any, _: Partial<CaseKysely>) => value as CaseStatus,
    trialDate: (value: typeof dwCaseSchema.trialDate, _: Partial<CaseKysely>) =>
      value?.toISOString(),
  } as const;

  return new DatabaseToAppCodeMapper({ keyRenameMap, transformMap }).transform(
    record,
  );
}
