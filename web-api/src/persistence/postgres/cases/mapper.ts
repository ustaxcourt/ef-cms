import { marshall } from '@aws-sdk/util-dynamodb';
import { Case } from '@shared/business/entities/cases/Case';
import { RawPetitioner } from '@shared/business/entities/contacts/Petitioner';
import {
  CaseStatus,
  CaseType,
} from '@shared/business/entities/EntityConstants';
import {
  calculateDate,
  formatNow,
} from '@shared/business/utilities/DateHandler';
import { CaseKysely } from '@web-api/database-types';
import { TDynamoRecord } from '@web-api/persistence/dynamo/dynamoTypes';
import {
  ReplaceNullWithUndefined,
  transformNullToUndefined,
} from '@web-api/persistence/postgres/utils/transformNullToUndefined';

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
    docketNumberSuffix: rawCase.docketNumberSuffix || undefined,
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

// Map for renaming keys from DB format to the desired RawCase format.
const keyRenameMap = {
  caption: 'caseCaption',
} as const;

// Map for transforming values.
// Each transform function accepts the original value and the entire record.
const transformMap = {
  automaticBlockedDate: (value: any, _: any) => value?.toISOString(),
  blockedDate: (value: any, _: any) => value?.toISOString(),
  caseType: (value: any, _: any) => value as CaseType,
  closedDate: (value: any, _: any) => value?.toISOString(),
  createdAt: (value: any, _: any) => value?.toISOString(),
  hearings: (value: any, _: any) => value || [],
  irsNoticeDate: (value: any, _: any) => value?.toISOString(),
  noticeOfTrialDate: (value: any, _: any) => value?.toISOString(),
  petitioners: (value?: any[], _: any) =>
    value ? value.map(p => ({ ...p, state: p.state || null })) : value, // petitioner state needs to be null rather than undefined
  petitionPaymentDate: (value: any, _: any) => value?.toISOString(),
  petitionPaymentWaivedDate: (value: any, _: any) => value?.toISOString(),
  receivedAt: (value: any, _: any) => value?.toISOString(),
  sealedDate: (value: any, _: any) => value?.toISOString(),
  status: (value: any, _: any) => value as CaseStatus,
  trialDate: (value: any, _: any) => value?.toISOString(),
} as const;

// A type for converting from CaseKysely (our DB type) to [some subset of] RawCase (+ any other extraneous key-value pairs unrelated to CaseKysely)
type Transformed<T> = {
  [K in keyof T as K extends keyof typeof keyRenameMap
    ? (typeof keyRenameMap)[K]
    : K]: K extends keyof typeof transformMap
    ? ReturnType<(typeof transformMap)[K]>
    : T[K];
};

// Convert from our DB representation of case data to our app-code representation
// You can pass in some subset of CaseKysely data (+ any other random key-value pairs)
// and get back some subset of appropriately mapped RawCase data (+ any other random key-value pairs)
export function transformDBCaseToEntity<T extends object>(
  record: T,
): ReplaceNullWithUndefined<Transformed<T>> {
  const result = { ...record } as any;

  // Do any transformations that need to happen to get from CaseKysely to RawCase
  // E.g., convert a date field to a string
  for (const key in transformMap) {
    if (key in result) {
      result[key] = transformMap[key](result[key], result);
    }
  }

  // Rename any keys that have name X in CaseKysely and name Y in RawCase
  for (const oldKey in keyRenameMap) {
    if (oldKey in result) {
      const newKey = keyRenameMap[oldKey];
      result[newKey] = result[oldKey];
      delete result[oldKey];
    }
  }

  // We typically expect undefined rather than null in our app
  // So convert Postgres null to Typescript undefined by default
  return transformNullToUndefined(
    result as Transformed<T>,
  ) as ReplaceNullWithUndefined<Transformed<T>>;
}

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
    { removeUndefinedValues: true },
  );
};
