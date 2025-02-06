import {
  calculateDate,
  formatNow,
} from '@shared/business/utilities/DateHandler';

export const DW_CASE_COLUMNS = [
  'associatedJudge',
  'associatedJudgeId',
  'automaticBlocked',
  'automaticBlockedDate',
  'automaticBlockedReason',
  'blocked',
  'blockedDate',
  'blockedReason',
  'canAllowDocumentService',
  'canAllowPrintableDocketRecord',
  'canDojPractitionersRepresentParty',
  'caption',
  'caseNote',
  'caseType',
  'closedDate',
  'createdAt',
  'damages',
  'docketNumber',
  'docketNumberSuffix',
  'filingType',
  'hasPendingItems',
  'hasVerifiedIrsNotice',
  'hearings',
  'highPriority',
  'highPriorityReason',
  'initialCaption',
  'initialDocketNumberSuffix',
  'irsNoticeDate',
  'isPaper',
  'isSealed',
  'judgeUserId',
  'leadDocketNumber',
  'litigationCosts',
  'mailingDate',
  'noticeOfAttachments',
  'noticeOfTrialDate',
  'orderDesignatingPlaceOfTrial',
  'orderForAmendedPetition',
  'orderForAmendedPetitionAndFilingFee',
  'orderForCds',
  'orderForFilingFee',
  'orderForRatification',
  'orderToShowCause',
  'partyType',
  'petitionPaymentDate',
  'petitionPaymentMethod',
  'petitionPaymentStatus',
  'petitionPaymentWaivedDate',
  'preferredTrialCity',
  'procedureType',
  'qcCompleteForTrial',
  'receivedAt',
  'sealedDate',
  'sortableDocketNumber',
  'status',
  'trialDate',
  'trialLocation',
  'trialSessionId',
  'trialTime',
  'useSameAsPrimary',
];

export const DW_CASE_STATUS_UPDATES_COLUMNS = [
  'changedBy',
  'date',
  'docketNumber',
  'updatedCaseStatus',
];

export const DW_PETITIONERS_ON_CASE = [
  'additionalName',
  'contactType',
  'docketNumber',
  'hasConsentedToEService',
  'hasEAccess',
  'inCareOf',
  'isAddressSealed',
  'paperPetitionEmail',
  'placeOfLegalResidence',
  'sealedAndUnavailable',
  'secondaryName',
  'serviceIndicator',
  'title',
  'orderOnCase',
  'address1',
  'address2',
  'address3',
  'city',
  'contactId',
  'country',
  'countryType',
  'email',
  'name',
  'phone',
  'postalCode',
  'state',
];

export const DW_CASE_STATISTIC_COLUMN = [
  'docketNumber',
  'irsDeficiencyAmount',
  'irsTotalPenalties',
  'statisticId',
  'year',
  'yearOrPeriod',
  'determinationDeficiencyAmount',
  'determinationTotalPenalties',
  'lastDateOfPeriod',
];

export const convertRawCaseToDbRow = (rawCase: RawCase) => {
  return {
    associatedJudge: rawCase.associatedJudge,
    associatedJudgeId: rawCase.associatedJudgeId,
    automaticBlocked: rawCase.automaticBlocked,
    automaticBlockedDate: rawCase.automaticBlockedDate
      ? calculateDate({ dateString: rawCase.automaticBlockedDate })
      : null,
    automaticBlockedReason: rawCase.automaticBlockedReason,
    blocked: rawCase.blocked,
    blockedDate: rawCase.blockedDate
      ? calculateDate({ dateString: rawCase.blockedDate })
      : null,
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
      : null,
    createdAt: rawCase.createdAt
      ? calculateDate({ dateString: rawCase.createdAt })
      : calculateDate({ dateString: formatNow() }), // Is this what we want?
    damages: rawCase.damages,
    docketNumber: rawCase.docketNumber,
    docketNumberSuffix: rawCase.docketNumberSuffix,
    docketEntries: JSON.stringify(rawCase.docketEntries),
    filingType: rawCase.filingType,
    hasPendingItems: rawCase.hasPendingItems,
    hasVerifiedIrsNotice: rawCase.hasVerifiedIrsNotice,
    hearings: JSON.stringify(rawCase.hearings),
    highPriority: rawCase.highPriority,
    highPriorityReason: rawCase.highPriorityReason,
    initialCaption: rawCase.initialCaption,
    initialDocketNumberSuffix: rawCase.initialDocketNumberSuffix,
    irsNoticeDate: rawCase.irsNoticeDate
      ? calculateDate({ dateString: rawCase.irsNoticeDate })
      : null,
    isPaper: rawCase.isPaper,
    isSealed: rawCase.isSealed,
    judgeUserId: rawCase.judgeUserId,
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

export const convertDbRowToRawCase = (dbCase: any): RawCase => {
  return {
    ...dbCase,
    automaticBlockedDate: dbCase.automaticBlockedDate?.toISOString(),
    blockedDate: dbCase.blockedDate?.toISOString(),
    caseCaption: dbCase.caption,
    closedDate: dbCase.closedDate?.toISOString(),
    createdAt: dbCase.createdAt?.toISOString(),
    docketNumberWithSuffix:
      dbCase.docketNumber +
      (dbCase.docketNumberSuffix ? dbCase.docketNumberSuffix : ''),
    hearings: dbCase.hearings || [],
    irsNoticeDate: dbCase.irsNoticeDate?.toISOString(),
    noticeOfTrialDate: dbCase.noticeOfTrialDate?.toISOString(),
    petitionPaymentDate: dbCase.petitionPaymentDate?.toISOString(),
    petitionPaymentWaivedDate: dbCase.petitionPaymentWaivedDate?.toISOString(),
    receivedAt: dbCase.receivedAt?.toISOString(),
    sealedDate: dbCase.sealedDate?.toISOString(),
    trialDate: dbCase.trialDate?.toISOString(),
  };
};
