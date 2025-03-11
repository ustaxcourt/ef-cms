import { marshall } from '@aws-sdk/util-dynamodb';
import { Case } from '@shared/business/entities/cases/Case';
import { RawPetitioner } from '@shared/business/entities/contacts/Petitioner';
import { RawEligibleCase } from '@shared/business/entities/cases/EligibleCase';
import {
  calculateDate,
  formatNow,
} from '@shared/business/utilities/DateHandler';
import { CaseKysely } from '@web-api/database-types';
import { TDynamoRecord } from '@web-api/persistence/dynamo/dynamoTypes';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

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
  'statusUpdateId',
  'changedBy',
  'date',
  'docketNumber',
  'updatedCaseStatus',
];

export const DW_PETITIONERS_ON_CASE_COLUMNS = [
  'additionalName',
  'contactType',
  'docketNumber',
  'hasConsentedToElectronicService',
  'hasElectronicAccess',
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

export const DW_CASE_STATISTIC_COLUMNS = [
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

export const DW_STATISTIC_PENALTY_COLUMNS = [
  'statisticId',
  'name',
  'penaltyAmount',
  'penaltyId',
  'penaltyType',
];

export const toKyselyNewCase = (rawCase: RawCase) => {
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
    docketNumberWithSuffix: rawCase.docketNumberWithSuffix,
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

export const rawCaseEntity = (caseRecord: any): RawCase => {
  return {
    ...caseRecord,
    automaticBlockedDate: caseRecord.automaticBlockedDate?.toISOString(),
    blockedDate: caseRecord.blockedDate?.toISOString(),
    caseCaption: caseRecord.caption,
    closedDate: caseRecord.closedDate?.toISOString(),
    createdAt: caseRecord.createdAt?.toISOString(),
    docketNumberWithSuffix:
      caseRecord.docketNumber +
      (caseRecord.docketNumberSuffix ? caseRecord.docketNumberSuffix : ''),
    hearings: caseRecord.hearings || [],
    irsNoticeDate: caseRecord.irsNoticeDate?.toISOString(),
    noticeOfTrialDate: caseRecord.noticeOfTrialDate?.toISOString(),
    petitionPaymentDate: caseRecord.petitionPaymentDate?.toISOString(),
    petitionPaymentWaivedDate:
      caseRecord.petitionPaymentWaivedDate?.toISOString(),
    receivedAt: caseRecord.receivedAt?.toISOString(),
    sealedDate: caseRecord.sealedDate?.toISOString(),
    trialDate: caseRecord.trialDate?.toISOString(),
  };
};

export const indexCaseEntity = ({
  caseRecord,
  privatePractitioners,
  irsPractitioners,
  petitioners,
}: {
  caseRecord: CaseKysely;
  privatePractitioners: TDynamoRecord[];
  irsPractitioners: TDynamoRecord[];
  petitioners: RawPetitioner[];
}) => {
  return marshall(
    transformNullToUndefined({
      pk: `case|${caseRecord.docketNumber}`,
      sk: `case|${caseRecord.docketNumber}`,
      associatedJudge: caseRecord.associatedJudge,
      associatedJudgeId: caseRecord.associatedJudgeId,
      automaticBlocked: caseRecord.automaticBlocked,
      automaticBlockedDate:
        caseRecord.automaticBlockedDate instanceof Date
          ? caseRecord.automaticBlockedDate?.toISOString()
          : caseRecord.automaticBlockedDate,
      automaticBlockedReason: caseRecord.automaticBlockedReason,
      blocked: caseRecord.blocked,
      blockedDate:
        caseRecord.blockedDate instanceof Date
          ? caseRecord.blockedDate?.toISOString()
          : caseRecord.blockedDate,
      blockedReason: caseRecord.blockedReason,
      caseType: caseRecord.caseType,
      closedDate:
        caseRecord.closedDate instanceof Date
          ? caseRecord.closedDate?.toISOString()
          : caseRecord.closedDate,
      createdAt:
        caseRecord.createdAt instanceof Date
          ? caseRecord.createdAt?.toISOString()
          : caseRecord.createdAt,
      hasPendingItems: caseRecord.hasPendingItems,
      highPriority: caseRecord.highPriority,
      isPaper: caseRecord.isPaper,
      leadDocket: caseRecord.leadDocketNumber,
      preferredTrialCity: caseRecord.preferredTrialCity,
      procedureType: caseRecord.procedureType,
      sealedDate:
        caseRecord.sealedDate instanceof Date
          ? caseRecord.sealedDate?.toISOString()
          : caseRecord.sealedDate,
      sortableDocketNumber: caseRecord.sortableDocketNumber,
      status: caseRecord.status,
      trialDate:
        caseRecord.trialDate instanceof Date
          ? caseRecord.trialDate?.toISOString()
          : caseRecord.trialDate,
      trialLocation: caseRecord.trialLocation,
      entityName: 'Case',
      caseCaption: caseRecord.caption,
      docketNumber: caseRecord.docketNumber,
      docketNumberWithSuffix: Case.getDocketNumberWithSuffix({
        docketNumber: caseRecord.docketNumber,
        docketNumberSuffix: caseRecord.docketNumberSuffix,
      }),
      isSealed: caseRecord.isSealed,
      petitioners: petitioners || [],
      receivedAt:
        caseRecord.receivedAt instanceof Date
          ? caseRecord.receivedAt.toISOString()
          : caseRecord.receivedAt,
      privatePractitioners,
      irsPractitioners,
    }),
  );
};

export const convertDbRowToRawEligibleCase = (dbCase: any): RawEligibleCase => {
  return {
    ...dbCase,
    caseCaption: dbCase.caption,
  };
};
