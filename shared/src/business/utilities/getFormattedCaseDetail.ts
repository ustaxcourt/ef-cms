import {
  CASE_STATUS_TYPES,
  COURT_ISSUED_EVENT_CODES,
  OBJECTIONS_OPTIONS_MAP,
  PAYMENT_STATUS,
  STIPULATED_DECISION_EVENT_CODE,
  TRANSCRIPT_EVENT_CODE,
} from '../entities/EntityConstants';
import { Case, isSealedCase } from '../entities/cases/Case';
import { DocketEntry } from '../entities/DocketEntry';
import {
  FORMATS,
  calculateDifferenceInDays,
  combineISOandEasternTime,
  formatDateString,
} from './DateHandler';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { cloneDeep, isEmpty, sortBy } from 'lodash';
import { isMiscellaneousDocketEntry } from '@shared/business/utilities/isMiscellaneousDocketEntry';
import { setServiceIndicatorsForPetitionersOnCase } from '@shared/business/utilities/setServiceIndicatorsForPetitionersOnCase';
import { type ClientApplicationContext } from '@web-client/applicationContext';
import { type ClientPublicApplicationContext } from '@web-client/applicationContextPublic';
import { type ServerApplicationContext } from '@web-api/applicationContext';

export type FormattedCaseInventoryReportEntry = {
  docketNumber: string;
  caseTitle: string;
  consolidatedIconTooltipText: string;
  inConsolidatedGroup: boolean;
  isLeadCase: boolean;
  associatedJudge?: string;
  status: string;
  [key: string]: unknown;
};

const computeIsInProgress = ({ formattedEntry }) => {
  return (
    (!formattedEntry.isCourtIssuedDocument &&
      formattedEntry.isFileAttached === false &&
      !DocketEntry.isMinuteEntry(formattedEntry) &&
      !formattedEntry.isUnservable) ||
    (formattedEntry.isFileAttached === true &&
      !DocketEntry.isServed(formattedEntry) &&
      !formattedEntry.isUnservable)
  );
};

export const computeIsNotServedDocument = ({ formattedEntry }) => {
  return (
    formattedEntry.isDraft ||
    (!DocketEntry.isServed(formattedEntry) &&
      !DocketEntry.isUnservable(formattedEntry) &&
      !DocketEntry.isMinuteEntry(formattedEntry))
  );
};

export type FormattedCaseDetailDocketEntry = RawDocketEntry & {
  certificateOfServiceDateFormatted: string;
  createdAtFormatted: string;
  descriptionDisplay: string;
  filingsAndProceedings: string;
  hasWorkItemInfo: boolean;
  isCourtIssuedDocument: boolean;
  isInProgress: boolean;
  isNotServedDocument: boolean;
  isPetition: boolean;
  isStatusServed: boolean;
  isStipDecision: boolean;
  isTranscript: boolean;
  isUnservable: boolean;
  qcNeeded: boolean;
  qcWorkItemsCompleted: boolean;
  qcWorkItemsUntouched: boolean;
  sealedToTooltip: string;
  servedAtFormatted: string;
  showLegacySealed: boolean;
  showServedAt: boolean;
  signedAtFormatted: string;
  signedAtFormattedTZ: string;
  sortingFilingDate: string;
};

export const formatDocketEntry = (
  applicationContext:
    | ServerApplicationContext
    | ClientApplicationContext
    | ClientPublicApplicationContext,
  docketEntry: RawDocketEntry,
): FormattedCaseDetailDocketEntry => {
  const preformattedEntry = cloneDeep(docketEntry);
  const hasWorkItemInfo = DocketEntry.hasWorkItemInfo(preformattedEntry);
  const isCourtIssuedDocument = COURT_ISSUED_EVENT_CODES.map(
    ({ eventCode }) => eventCode,
  ).includes(preformattedEntry.eventCode);
  const isUnservable = DocketEntry.isUnservable(preformattedEntry);
  const isInProgress = computeIsInProgress({
    formattedEntry: { ...preformattedEntry, isUnservable },
  });
  const qcWorkItemsUntouched = hasWorkItemInfo && !preformattedEntry.qcComplete;

  const createdAtISO =
    isCourtIssuedDocument &&
    !preformattedEntry.servedAt &&
    !isUnservable &&
    preformattedEntry.isOnDocketRecord
      ? ''
      : preformattedEntry.isOnDocketRecord
        ? formatDateString(preformattedEntry.filingDate, FORMATS.ISO)
        : formatDateString(preformattedEntry.createdAt, FORMATS.ISO);
  const createdAtFormatted = formatDateString(createdAtISO, 'MMDDYY');
  const certificateOfServiceDateFormatted =
    preformattedEntry.certificateOfServiceDate
      ? formatDateString(preformattedEntry.certificateOfServiceDate, 'MMDDYY')
      : '';
  const filingsAndProceedings = getFilingsAndProceedings({
    ...preformattedEntry,
    certificateOfServiceDateFormatted,
  });

  return {
    ...preformattedEntry,
    certificateOfServiceDateFormatted,
    createdAtFormatted,
    descriptionDisplay: applicationContext
      .getUtilities()
      .getDescriptionDisplay(preformattedEntry),
    eventCode: preformattedEntry.lodged ? 'MISCL' : preformattedEntry.eventCode,
    filingsAndProceedings,
    hasWorkItemInfo,
    isCourtIssuedDocument,
    isInProgress,
    isNotServedDocument: computeIsNotServedDocument({
      formattedEntry: preformattedEntry,
    }),
    isPetition:
      preformattedEntry.documentType === 'Petition' ||
      preformattedEntry.eventCode === 'P',
    isStatusServed: !!preformattedEntry.servedAt,
    isStipDecision:
      preformattedEntry.eventCode === STIPULATED_DECISION_EVENT_CODE,
    isTranscript: preformattedEntry.eventCode === TRANSCRIPT_EVENT_CODE,
    isUnservable,
    qcNeeded: qcWorkItemsUntouched && !isInProgress,
    qcWorkItemsCompleted: !hasWorkItemInfo || !!preformattedEntry.qcComplete,
    qcWorkItemsUntouched,
    sealedToTooltip: preformattedEntry.isLegacySealed
      ? 'Sealed in Blackstone'
      : preformattedEntry.isSealed
        ? applicationContext
            .getUtilities()
            .getSealedDocketEntryTooltip(applicationContext, preformattedEntry)
        : '',
    servedAtFormatted: formatDateString(preformattedEntry.servedAt, 'MMDDYY'),
    showLegacySealed: !!preformattedEntry.isLegacySealed,
    showServedAt: !!preformattedEntry.servedAt,
    signedAtFormatted: formatDateString(preformattedEntry.signedAt, 'MMDDYY'),
    signedAtFormattedTZ: formatDateString(
      preformattedEntry.signedAt,
      'DATE_TIME_TZ',
    ),
    sortingFilingDate: createdAtISO
      ? formatDateString(createdAtISO, 'YYYYMMDD_NUMERIC')
      : '',
  };
};

export const getFilingsAndProceedings = formattedDocketEntry => {
  //filings and proceedings string
  //(C/S 04/17/2019) (Exhibit(s)) (Attachment(s)) (Objection) (Lodged)
  const filingsAndProceedingsArray = [
    `${
      formattedDocketEntry.certificateOfService
        ? `(C/S ${formattedDocketEntry.certificateOfServiceDateFormatted})`
        : ''
    }`,
    `${formattedDocketEntry.attachments ? '(Attachment(s))' : ''}`,
    `${
      formattedDocketEntry.objections === OBJECTIONS_OPTIONS_MAP.YES
        ? '(Objection)'
        : formattedDocketEntry.objections === OBJECTIONS_OPTIONS_MAP.NO
          ? '(No Objection)'
          : ''
    }`,
    `${formattedDocketEntry.lodged ? '(Lodged)' : ''}`,
  ];

  return filingsAndProceedingsArray.filter(item => item !== '').join(' ');
};

/**
 * formats trial session fields for display
 * @param {string} judgeName the name of the judge
 * @param {string} trialDate ISO-8601 GMT timestamp
 * @param {string} trialLocation location of the trial
 * @param {string} trialTime eastern time zone string representing hours and minutes HH:mm
 * @returns formatted trial session fields
 */

const formattedTrialSessionDetails = ({
  judgeName,
  trialDate,
  trialLocation,
  trialTime,
}) => {
  let formattedTrialDate;

  const formattedTrialCity = trialLocation || 'Not assigned';
  const formattedAssociatedJudge = judgeName || 'Not assigned';

  if (!trialDate) {
    formattedTrialDate = 'Not scheduled';
  } else if (trialTime) {
    const combinedDateTime = combineISOandEasternTime(trialDate, trialTime);
    formattedTrialDate = formatDateString(combinedDateTime, FORMATS.DATE_TIME);
  } else {
    formattedTrialDate = formatDateString(trialDate, FORMATS.MMDDYY);
  }

  return {
    formattedAssociatedJudge,
    formattedTrialCity,
    formattedTrialDate,
  };
};

/**
 * sets formatted values reflecting the trial scheduling status
 * of the given case. Modify the formattedCase argument by reference.
 */
const formatTrialSessionScheduling = ({
  applicationContext,
  formattedCase,
}) => {
  formattedCase.formattedPreferredTrialCity =
    formattedCase.preferredTrialCity || 'No location selected';
  if (formattedCase.trialSessionId) {
    if (formattedCase.status === CASE_STATUS_TYPES.calendared) {
      formattedCase.showTrialCalendared = true;
    } else {
      formattedCase.showScheduled = true;
    }

    Object.assign(
      formattedCase,
      formattedTrialSessionDetails({
        judgeName: formattedCase.associatedJudge,
        trialDate: formattedCase.trialDate,
        trialLocation: formattedCase.trialLocation,
        trialTime: formattedCase.trialTime,
      }),
    );

    // TODO: get trial session note
  } else if (formattedCase.blocked) {
    formattedCase.showBlockedFromTrial = true;
    formattedCase.blockedDateFormatted = applicationContext
      .getUtilities()
      .formatDateString(formattedCase.blockedDate, 'MMDDYY');
  } else {
    formattedCase.showNotScheduled = true;
  }

  // Format hearings
  if (formattedCase.hearings && formattedCase.hearings.length) {
    formattedCase.hearings.forEach(hearing => {
      Object.assign(
        hearing,
        formattedTrialSessionDetails({
          judgeName: hearing.judge && hearing.judge.name,
          trialDate: hearing.startDate,
          trialLocation: hearing.trialLocation,
          trialTime: hearing.startTime,
        }),
      );
    });
  }
};

const getEditUrl = (docketEntry: RawDocketEntry): string => {
  const routeToEditUploadCourtIssued = isMiscellaneousDocketEntry(docketEntry);

  return routeToEditUploadCourtIssued
    ? `/case-detail/${docketEntry.docketNumber}/edit-upload-court-issued/${docketEntry.docketEntryId}`
    : `/case-detail/${docketEntry.docketNumber}/edit-order/${docketEntry.docketEntryId}`;
};

export const formatCase = (
  applicationContext,
  caseDetail,
  authorizedUser: UnknownAuthUser,
) => {
  if (isEmpty(caseDetail)) {
    return {};
  }
  const result = cloneDeep(caseDetail);

  if (result.docketEntries) {
    result.draftDocumentsUnsorted = result.docketEntries
      .filter(docketEntry => docketEntry.isDraft && !docketEntry.archived)
      .map(docketEntry => ({
        ...formatDocketEntry(applicationContext, docketEntry),
        editUrl: getEditUrl(docketEntry),
        signUrl: `/case-detail/${caseDetail.docketNumber}/edit-order/${docketEntry.docketEntryId}/sign`,
        signedAtFormatted: applicationContext
          .getUtilities()
          .formatDateString(docketEntry.signedAt, 'MMDDYY'),
        signedAtFormattedTZ: applicationContext
          .getUtilities()
          .formatDateString(docketEntry.signedAt, 'DATE_TIME_TZ'),
      }));

    result.draftDocuments = sortBy(result.draftDocumentsUnsorted, 'receivedAt');

    result.formattedDocketEntries = result.docketEntries.map(d =>
      formatDocketEntry(applicationContext, d),
    );
    // establish an initial sort by ascending index
    result.formattedDocketEntries.sort(byIndexSortFunction);
    result.pendingItemsDocketEntries = result.formattedDocketEntries.filter(
      entry => applicationContext.getUtilities().isPending(entry),
    );
  }

  if (result.correspondence && result.correspondence.length) {
    result.correspondence.forEach(doc => {
      doc.formattedFilingDate = applicationContext
        .getUtilities()
        .formatDateString(doc.filingDate, 'MMDDYY');
    });
  }

  if (result.irsPractitioners) {
    result.irsPractitioners = result.irsPractitioners.map(counsel => {
      return formatCounsel({ caseDetail, counsel });
    });
  }

  if (result.privatePractitioners) {
    result.privatePractitioners = result.privatePractitioners.map(counsel => {
      return formatCounsel({ caseDetail, counsel });
    });
  }

  result.createdAtFormatted = applicationContext
    .getUtilities()
    .formatDateString(result.createdAt, 'MMDDYY');
  result.receivedAtFormatted = applicationContext
    .getUtilities()
    .formatDateString(result.receivedAt, 'MMDDYY');

  result.irsNoticeDateFormatted = result.irsNoticeDate
    ? applicationContext
        .getUtilities()
        .formatDateString(result.irsNoticeDate, 'MMDDYY')
    : 'No notice provided';

  result.shouldShowIrsNoticeDate = result.hasVerifiedIrsNotice;

  result.caseTitle = applicationContext.getCaseTitle(
    caseDetail.caseCaption || '',
  );

  result.isSealed = isSealedCase(caseDetail);

  formatTrialSessionScheduling({ applicationContext, formattedCase: result });

  result.isLeadCase = applicationContext.getUtilities().isLeadCase(result);

  result.isConsolidatedSubCase = !!(
    result.leadDocketNumber && !result.isLeadCase
  );

  result.inConsolidatedGroup =
    result.isLeadCase || result.isConsolidatedSubCase;

  let consolidatedIconTooltipText;

  if (result.inConsolidatedGroup) {
    if (result.isLeadCase) {
      consolidatedIconTooltipText = 'Lead case';
    } else {
      consolidatedIconTooltipText = 'Consolidated case';
    }
  }

  result.consolidatedIconTooltipText = consolidatedIconTooltipText;

  let paymentDate = '';
  let paymentMethod = '';
  if (caseDetail.petitionPaymentStatus === PAYMENT_STATUS.PAID) {
    paymentDate = applicationContext
      .getUtilities()
      .formatDateString(caseDetail.petitionPaymentDate, 'MMDDYY');
    paymentMethod = caseDetail.petitionPaymentMethod;
  } else if (caseDetail.petitionPaymentStatus === PAYMENT_STATUS.WAIVED) {
    paymentDate = applicationContext
      .getUtilities()
      .formatDateString(caseDetail.petitionPaymentWaivedDate, 'MMDDYY');
  }
  result.filingFee = `${caseDetail.petitionPaymentStatus} ${paymentDate} ${paymentMethod}`;

  const caseEntity = new Case(caseDetail, {
    authorizedUser,
  });
  result.canConsolidate = caseEntity.canConsolidate(caseEntity);
  result.canUnconsolidate = !!caseEntity.leadDocketNumber;
  result.irsSendDate = caseEntity.getIrsSendDate();
  result.showPrintConfirmationLink =
    result.irsSendDate && !result.docketEntries.some(d => d.isLegacy);

  if (result.consolidatedCases) {
    result.consolidatedCases = result.consolidatedCases.map(
      consolidatedCase => {
        return formatCase(applicationContext, consolidatedCase, authorizedUser);
      },
    );
  }

  return result;
};

const byIndexSortFunction = (a, b) => {
  if (!a.index && !b.index) {
    return 0;
  } else if (!a.index) {
    return 1;
  } else if (!b.index) {
    return -1;
  }
  return a.index - b.index;
};

const getDocketRecordSortFunc = sortByString => {
  const byDate = (a, b) => {
    const compared = calculateDifferenceInDays(a.filingDate, b.filingDate);
    if (compared === 0) {
      return byIndexSortFunction(a, b);
    }
    return compared;
  };

  switch (sortByString) {
    case 'byIndex': // fall-through
    case 'byIndexDesc':
      return byIndexSortFunction;
    case 'byDate': // fall through, is the default sort method
    case 'byDateDesc':
    default:
      return byDate;
  }
};

const formatCounsel = ({ caseDetail, counsel }) => {
  let formattedName = counsel.name;

  if (counsel.barNumber) {
    formattedName += ` (${counsel.barNumber})`;
  }
  counsel.formattedName = formattedName;

  if (counsel.representing) {
    counsel.representingFormatted = [];

    caseDetail.petitioners.forEach(p => {
      if (counsel.representing.includes(p.contactId)) {
        counsel.representingFormatted.push({
          name: p.name,
          secondaryName: p.secondaryName,
          title: p.title,
        });
      }
    });
  }

  return counsel;
};

// sort items that do not display a filingDate (based on createdAtFormatted) at the bottom
export const sortUndefined = (
  a: { createdAtFormatted?: string; [key: string]: any },
  b: { createdAtFormatted?: string; [key: string]: any },
) => {
  if (a.createdAtFormatted && !b.createdAtFormatted) {
    return -1;
  }

  if (!a.createdAtFormatted && b.createdAtFormatted) {
    return 1;
  }

  return 0;
};

export const sortDocketEntries = (
  docketEntries: (RawDocketEntry & {
    createdAtFormatted: string | undefined;
  })[] = [],
  sortByString = '',
) => {
  const sortFunc = getDocketRecordSortFunc(sortByString);
  const isReversed = sortByString.includes('Desc');
  docketEntries.sort(sortFunc);
  if (isReversed) {
    // reversing AFTER the sort keeps sorting stable
    return docketEntries.reverse().sort(sortUndefined);
  }
  return docketEntries.sort(sortUndefined);
};

// Used by both front and backend
export const getFormattedCaseDetail = ({
  applicationContext,
  authorizedUser,
  caseDetail,
  docketRecordSort,
}: {
  applicationContext: IApplicationContext | ClientApplicationContext;
  caseDetail: RawCase;
  docketRecordSort?: string;
  authorizedUser: UnknownAuthUser;
}) => {
  const result = {
    ...setServiceIndicatorsForPetitionersOnCase(caseDetail),
    ...formatCase(applicationContext, caseDetail, authorizedUser),
  };
  result.formattedDocketEntries = sortDocketEntries(
    result.formattedDocketEntries,
    docketRecordSort,
  );
  result.docketRecordSort = docketRecordSort;

  return result;
};
