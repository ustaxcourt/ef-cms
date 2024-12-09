import {
  CASE_STATUS_TYPES,
  COURT_ISSUED_EVENT_CODES,
  OBJECTIONS_OPTIONS_MAP,
  PAYMENT_STATUS,
  STIPULATED_DECISION_EVENT_CODE,
  TRANSCRIPT_EVENT_CODE,
} from '../entities/EntityConstants';
import { Case, isSealedCase } from '../entities/cases/Case';
import {
  DOCKET_ENTRY_SORT_FIELDS,
  DocketRecordSortInfo,
  sortDocketEntries,
} from '@shared/business/utilities/sorting/docketEntrySorting';
import { DocketEntry } from '../entities/DocketEntry';
import {
  FORMATS,
  combineISOandEasternTime,
  formatDateString,
} from './DateHandler';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { cloneDeep, isEmpty, sortBy } from 'lodash';
import { isMiscellaneousDocketEntry } from '@shared/business/utilities/isMiscellaneousDocketEntry';

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

export const formatDocketEntry = (applicationContext, docketEntry) => {
  const formattedEntry = cloneDeep(docketEntry);

  formattedEntry.servedAtFormatted = formatDateString(
    formattedEntry.servedAt,
    'MMDDYY',
  );

  formattedEntry.signedAtFormatted = formatDateString(
    formattedEntry.signedAt,
    'MMDDYY',
  );

  formattedEntry.signedAtFormattedTZ = formatDateString(
    formattedEntry.signedAt,
    'DATE_TIME_TZ',
  );

  if (formattedEntry.certificateOfServiceDate) {
    formattedEntry.certificateOfServiceDateFormatted = formatDateString(
      formattedEntry.certificateOfServiceDate,
      'MMDDYY',
    );
  }
  if (formattedEntry.lodged) {
    formattedEntry.eventCode = 'MISCL';
  }
  formattedEntry.showLegacySealed = !!formattedEntry.isLegacySealed;
  formattedEntry.showServedAt = !!formattedEntry.servedAt;
  formattedEntry.isStatusServed = !!formattedEntry.servedAt;
  formattedEntry.isPetition =
    formattedEntry.documentType === 'Petition' ||
    formattedEntry.eventCode === 'P';

  formattedEntry.isCourtIssuedDocument = !!COURT_ISSUED_EVENT_CODES.map(
    ({ eventCode }) => eventCode,
  ).includes(formattedEntry.eventCode);

  const qcWorkItem = formattedEntry.workItem;

  formattedEntry.qcWorkItemsCompleted = !qcWorkItem || !!qcWorkItem.completedAt;

  formattedEntry.isUnservable = DocketEntry.isUnservable(formattedEntry);

  formattedEntry.isInProgress = computeIsInProgress({ formattedEntry });

  formattedEntry.isNotServedDocument = computeIsNotServedDocument({
    formattedEntry,
  });

  formattedEntry.isTranscript =
    formattedEntry.eventCode === TRANSCRIPT_EVENT_CODE;

  formattedEntry.isStipDecision =
    formattedEntry.eventCode === STIPULATED_DECISION_EVENT_CODE;

  formattedEntry.qcWorkItemsUntouched = qcWorkItem && !qcWorkItem.completedAt;

  formattedEntry.qcNeeded =
    formattedEntry.qcWorkItemsUntouched && !formattedEntry.isInProgress;

  if (
    formattedEntry.isCourtIssuedDocument &&
    !formattedEntry.servedAt &&
    !formattedEntry.isUnservable &&
    formattedEntry.isOnDocketRecord
  ) {
    formattedEntry.createdAtFormatted = '';
  } else if (formattedEntry.isOnDocketRecord) {
    formattedEntry.createdAtFormatted = applicationContext
      .getUtilities()
      .formatDateString(formattedEntry.filingDate, 'MMDDYY');
    formattedEntry.sortingFilingDate = applicationContext
      .getUtilities()
      .formatDateString(formattedEntry.filingDate, 'YYYYMMDD_NUMERIC');
  } else {
    formattedEntry.createdAtFormatted = applicationContext
      .getUtilities()
      .formatDateString(formattedEntry.createdAt, 'MMDDYY');
    formattedEntry.sortingFilingDate = applicationContext
      .getUtilities()
      .formatDateString(formattedEntry.createdAt, 'YYYYMMDD_NUMERIC');
  }

  formattedEntry.filingsAndProceedings =
    getFilingsAndProceedings(formattedEntry);

  formattedEntry.descriptionDisplay = applicationContext
    .getUtilities()
    .getDescriptionDisplay(formattedEntry);

  if (formattedEntry.lodged) {
    formattedEntry.eventCode = 'MISCL';
  }

  return formattedEntry;
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
  let formattedTrialCity;
  let formattedAssociatedJudge;
  let formattedTrialDate;

  formattedTrialCity = trialLocation || 'Not assigned';
  formattedAssociatedJudge = judgeName || 'Not assigned';

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
  } else if (formattedCase.highPriority) {
    formattedCase.formattedTrialDate = 'Not scheduled';
    formattedCase.formattedAssociatedJudge = 'Not assigned';
    formattedCase.showPrioritized = true;
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
    result.formattedDocketEntries = sortDocketEntries({
      docketEntries: result.formattedDocketEntries,
      sortByField: DOCKET_ENTRY_SORT_FIELDS.index,
    });
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
  result.canConsolidate = caseEntity.canConsolidate();
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

// Used by both front and backend
export const getFormattedCaseDetail = ({
  applicationContext,
  authorizedUser,
  caseDetail,
  docketRecordSortInfo,
}: {
  applicationContext: IApplicationContext;
  caseDetail: RawCase;
  docketRecordSortInfo?: DocketRecordSortInfo;
  authorizedUser: UnknownAuthUser;
}) => {
  const result = {
    ...applicationContext
      .getUtilities()
      .setServiceIndicatorsForCase(caseDetail),
    ...formatCase(applicationContext, caseDetail, authorizedUser),
  };
  result.formattedDocketEntries = sortDocketEntries({
    ascending: docketRecordSortInfo?.ascending,
    docketEntries: result.formattedDocketEntries,
    sortByField: docketRecordSortInfo?.sortByField,
  });
  result.docketRecordSortInfo = docketRecordSortInfo;

  return result;
};
