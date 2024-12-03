import {
  calculateDate,
  formatNow,
} from '@shared/business/utilities/DateHandler';

// 10502 TODO: Will this be needed? It seems better to be explicit about the fields we want rather than omitting fields we don't.
export const fieldsToOmitBeforePersisting = [
  'archivedCorrespondences',
  'archivedDocketEntries',
  'caseCaption',
  'consolidatedCases',
  'correspondence',
  'docketEntries',
  'hearings',
  'irsPractitioners',
  'privatePractitioners',
  'entityName',
  'petitioners',
  'docketNumberWithSuffix',
] as const;

export const toNewKyselyCase = (rawCase: RawCase) => {
  return {
    associatedJudge: rawCase.associatedJudge,
    associatedJudgeId: rawCase.associatedJudgeId,
    automaticBlocked: rawCase.automaticBlocked,
    automaticBlockedDate: rawCase.automaticBlockedDate
      ? calculateDate({ dateString: rawCase.automaticBlockedDate })
      : undefined,
    automaticBlockedReason: rawCase.automaticBlockedReason,
    blocked: rawCase.blocked,
    blockedDate: rawCase.blockedDate
      ? calculateDate({ dateString: rawCase.blockedDate })
      : undefined,
    blockedReason: rawCase.blockedReason,
    canAllowDocumentService: rawCase.canAllowDocumentService,
    canAllowPrintableDocketRecord: rawCase.canAllowPrintableDocketRecord,
    canDojPractitionersRepresentParty:
      rawCase.canDojPractitionersRepresentParty,
    caption: rawCase.caseCaption,
    caseNote: rawCase.caseNote,
    caseType: rawCase.caseType,
    closedDate: rawCase.closedDate
      ? calculateDate({ dateString: rawCase.closedDate })
      : undefined,
    createdAt: rawCase.createdAt
      ? calculateDate({ dateString: rawCase.createdAt })
      : calculateDate({ dateString: formatNow() }), // Is this what we want?
    damages: rawCase.damages,
    docketNumber: rawCase.docketNumber,
    docketNumberSuffix: rawCase.docketNumberSuffix,
    filingType: rawCase.filingType,
    hasPendingItems: rawCase.hasPendingItems,
    hasVerifiedIrsNotice: rawCase.hasVerifiedIrsNotice,
    hearings: rawCase.hearings,
    highPriority: rawCase.highPriority,
    highPriorityReason: rawCase.highPriorityReason,
    initialCaption: rawCase.initialCaption,
    initialDocketNumberSuffix: rawCase.initialDocketNumberSuffix,
    irsNoticeDate: rawCase.irsNoticeDate
      ? calculateDate({ dateString: rawCase.irsNoticeDate })
      : undefined,
    isPaper: rawCase.isPaper,
    isSealed: rawCase.isSealed,
    judgeUserId: rawCase.judgeUserId,
    leadDocketNumber: rawCase.leadDocketNumber,
    litigationCosts: rawCase.litigationCosts,
    mailingDate: rawCase.mailingDate,
    noticeOfAttachments: rawCase.noticeOfAttachments,
    noticeOfTrialDate: rawCase.noticeOfTrialDate
      ? calculateDate({ dateString: rawCase.noticeOfTrialDate })
      : undefined,
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
      : undefined,
    petitionPaymentMethod: rawCase.petitionPaymentMethod,
    petitionPaymentStatus: rawCase.petitionPaymentStatus,
    petitionPaymentWaivedDate: rawCase.petitionPaymentWaivedDate
      ? calculateDate({ dateString: rawCase.petitionPaymentWaivedDate })
      : undefined,
    preferredTrialCity: rawCase.preferredTrialCity,
    procedureType: rawCase.procedureType,
    qcCompleteForTrial: rawCase.qcCompleteForTrial,
    receivedAt: rawCase.receivedAt
      ? calculateDate({ dateString: rawCase.receivedAt })
      : calculateDate({ dateString: formatNow() }), // Is this what we want?
    sealedDate: rawCase.sealedDate
      ? calculateDate({ dateString: rawCase.sealedDate })
      : undefined,
    sortableDocketNumber: rawCase.sortableDocketNumber,
    statistics: rawCase.statistics,
    status: rawCase.status,
    trialDate: rawCase.trialDate
      ? calculateDate({ dateString: rawCase.trialDate })
      : undefined,
    trialLocation: rawCase.trialLocation,
    trialSessionId: rawCase.trialSessionId,
    trialTime: rawCase.trialTime,
    useSameAsPrimary: rawCase.useSameAsPrimary,
  };
};
