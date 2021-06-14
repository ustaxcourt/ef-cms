const {
  calculateDifferenceInDays,
  calculateISODate,
  createISODateString,
} = require('./DateHandler');
const {
  Case,
  getContactPrimary,
  getContactSecondary,
  getOtherFilers,
  getOtherPetitioners,
} = require('../entities/cases/Case');
const {
  CASE_STATUS_TYPES,
  CORRECTED_TRANSCRIPT_EVENT_CODE,
  COURT_ISSUED_EVENT_CODES,
  OBJECTIONS_OPTIONS_MAP,
  PAYMENT_STATUS,
  REVISED_TRANSCRIPT_EVENT_CODE,
  STIPULATED_DECISION_EVENT_CODE,
  TRANSCRIPT_EVENT_CODE,
  UNSERVABLE_EVENT_CODES,
} = require('../entities/EntityConstants');
const { cloneDeep, isEmpty, sortBy } = require('lodash');
const { isServed } = require('../entities/DocketEntry');

const TRANSCRIPT_AGE_DAYS_MIN = 90;
const documentMeetsAgeRequirements = doc => {
  const transcriptCodes = [
    TRANSCRIPT_EVENT_CODE,
    CORRECTED_TRANSCRIPT_EVENT_CODE,
    REVISED_TRANSCRIPT_EVENT_CODE,
  ];
  const isTranscript = transcriptCodes.includes(doc.eventCode);
  if (!isTranscript) return true;

  const dateStringToCheck = doc.isLegacy ? doc.filingDate : doc.date;
  const availableOnDate = calculateISODate({
    dateString: dateStringToCheck,
    howMuch: TRANSCRIPT_AGE_DAYS_MIN,
    units: 'days',
  });
  const rightNow = createISODateString();

  const meetsTranscriptAgeRequirements = availableOnDate <= rightNow;
  return meetsTranscriptAgeRequirements;
};

const formatCaseDeadline = (applicationContext, caseDeadline) => {
  const result = cloneDeep(caseDeadline);
  result.deadlineDateFormatted = applicationContext
    .getUtilities()
    .formatDateString(result.deadlineDate, 'MMDDYY');

  // use the app context utility function so the time zones match when comparing dates
  const deadlineDateMomented = applicationContext
    .getUtilities()
    .prepareDateFromString(result.deadlineDate);

  const today = applicationContext.getUtilities().prepareDateFromString();

  if (deadlineDateMomented.isBefore(today, 'day')) {
    result.overdue = true;
  }

  return result;
};

const computeIsInProgress = ({ formattedEntry }) => {
  return (
    (!formattedEntry.isCourtIssuedDocument &&
      formattedEntry.isFileAttached === false &&
      !formattedEntry.isMinuteEntry &&
      !formattedEntry.isUnservable) ||
    (formattedEntry.isFileAttached === true &&
      !isServed(formattedEntry) &&
      !formattedEntry.isUnservable)
  );
};

const computeIsNotServedDocument = ({ formattedEntry }) => {
  return (
    !isServed(formattedEntry) &&
    !formattedEntry.isUnservable &&
    !formattedEntry.isMinuteEntry
  );
};

const formatDocketEntry = (applicationContext, docketEntry) => {
  const formattedEntry = cloneDeep(docketEntry);

  const { formatDateString } = applicationContext.getUtilities();

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

  formattedEntry.isUnservable =
    UNSERVABLE_EVENT_CODES.includes(formattedEntry.eventCode) ||
    formattedEntry.isLegacyServed;

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
    formattedEntry.createdAtFormatted = undefined;
  } else if (formattedEntry.isOnDocketRecord) {
    formattedEntry.createdAtFormatted = applicationContext
      .getUtilities()
      .formatDateString(formattedEntry.filingDate, 'MMDDYY');
  } else {
    formattedEntry.createdAtFormatted = applicationContext
      .getUtilities()
      .formatDateString(formattedEntry.createdAt, 'MMDDYY');
  }

  formattedEntry.isAvailableToUser = documentMeetsAgeRequirements(
    formattedEntry,
  );

  formattedEntry.filingsAndProceedings = getFilingsAndProceedings(
    formattedEntry,
  );

  if (!formattedEntry.descriptionDisplay) {
    formattedEntry.descriptionDisplay = formattedEntry.documentTitle;
  }

  if (formattedEntry.additionalInfo) {
    if (formattedEntry.addToCoversheet) {
      formattedEntry.descriptionDisplay += ` ${formattedEntry.additionalInfo}`;
    } else {
      formattedEntry.additionalInfoDisplay = `${formattedEntry.additionalInfo}`;
    }
  }

  if (formattedEntry.lodged) {
    formattedEntry.eventCode = 'MISCL';
  }

  return formattedEntry;
};

const getFilingsAndProceedings = formattedDocketEntry => {
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

const formatCaseDeadlines = (applicationContext, caseDeadlines = []) => {
  caseDeadlines = caseDeadlines.map(d =>
    formatCaseDeadline(applicationContext, d),
  );

  return caseDeadlines.sort((a, b) =>
    String.prototype.localeCompare.call(a.deadlineDate, b.deadlineDate),
  );
};

/**
 * formats trial session fields for display
 *
 * @returns formatted trial session fields
 */

const formattedTrialSessionDetails = ({
  applicationContext,
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
    formattedTrialDate = applicationContext
      .getUtilities()
      .formatDateString(trialDate, 'YYYY-MM-DD');
    formattedTrialDate += `T${trialTime}:00`;
    formattedTrialDate = applicationContext
      .getUtilities()
      .formatDateString(formattedTrialDate, 'DATE_TIME');
  } else {
    formattedTrialDate = applicationContext
      .getUtilities()
      .formatDateString(trialDate, 'MMDDYY');
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
        applicationContext,
        judgeName: formattedCase.associatedJudge,
        trialDate: formattedCase.trialDate,
        trialLocation: formattedCase.trialLocation,
        trialTime: formattedCase.trialTime,
      }),
    );

    // TODO: get trial session note
  } else if (formattedCase.blocked) {
    formattedCase.showBlockedFromTrial = true;
    if (formattedCase.blocked) {
      formattedCase.blockedDateFormatted = applicationContext
        .getUtilities()
        .formatDateString(formattedCase.blockedDate, 'MMDDYY');
    }
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
          applicationContext,
          judgeName: hearing.judge && hearing.judge.name,
          trialDate: hearing.startDate,
          trialLocation: hearing.trialLocation,
          trialTime: hearing.startTime,
        }),
      );
    });
  }
};

const formatCase = (applicationContext, caseDetail) => {
  if (isEmpty(caseDetail)) {
    return {};
  }
  const result = cloneDeep(caseDetail);

  if (result.docketEntries) {
    result.draftDocumentsUnsorted = result.docketEntries
      .filter(docketEntry => docketEntry.isDraft && !docketEntry.archived)
      .map(docketEntry => ({
        ...formatDocketEntry(applicationContext, docketEntry),
        editUrl:
          docketEntry.documentType === 'Miscellaneous'
            ? `/case-detail/${caseDetail.docketNumber}/edit-upload-court-issued/${docketEntry.docketEntryId}`
            : `/case-detail/${caseDetail.docketNumber}/edit-order/${docketEntry.docketEntryId}`,
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

  const formatCounsel = counsel => {
    let formattedName = counsel.name;

    if (counsel.barNumber) {
      formattedName += ` (${counsel.barNumber})`;
    }
    counsel.formattedName = formattedName;

    if (counsel.representing) {
      counsel.representingFormatted = [];

      const contactPrimary = getContactPrimary(caseDetail);

      if (counsel.representing.includes(contactPrimary.contactId)) {
        counsel.representingFormatted.push({
          name: contactPrimary.name,
          secondaryName: contactPrimary.secondaryName,
          title: contactPrimary.title,
        });
      }

      const contactSecondary = getContactSecondary(caseDetail);

      if (
        contactSecondary &&
        counsel.representing.includes(contactSecondary.contactId)
      ) {
        counsel.representingFormatted.push({
          name: contactSecondary.name,
          secondaryName: contactSecondary.secondaryName,
          title: contactSecondary.title,
        });
      }

      const otherPetitioners = getOtherPetitioners(caseDetail);

      otherPetitioners.forEach(otherPetitioner => {
        if (counsel.representing.includes(otherPetitioner.contactId)) {
          counsel.representingFormatted.push({
            name: otherPetitioner.name,
            secondaryName: otherPetitioner.secondaryName,
            title: otherPetitioner.title,
          });
        }
      });

      getOtherFilers(caseDetail).forEach(otherFiler => {
        if (counsel.representing.includes(otherFiler.contactId)) {
          counsel.representingFormatted.push({
            name: otherFiler.name,
            secondaryName: otherFiler.secondaryName,
            title: otherFiler.title,
          });
        }
      });
    }
    return counsel;
  };

  if (result.irsPractitioners) {
    result.irsPractitioners = result.irsPractitioners.map(formatCounsel);
  }

  if (result.privatePractitioners) {
    result.privatePractitioners = result.privatePractitioners.map(
      formatCounsel,
    );
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

  formatTrialSessionScheduling({ applicationContext, formattedCase: result });

  result.isConsolidatedSubCase = !!(
    result.leadDocketNumber && result.leadDocketNumber !== result.docketNumber
  );

  result.isLeadCase = !!(
    result.leadDocketNumber && result.leadDocketNumber === result.docketNumber
  );

  let paymentDate = '';
  let paymentMethod = '';
  if (caseDetail.petitionPaymentStatus === PAYMENT_STATUS.PAID) {
    paymentDate = applicationContext
      .getUtilities()
      .formatDateString(caseDetail.petitionPaymentDate, 'MM/DD/YY');
    paymentMethod = caseDetail.petitionPaymentMethod;
  } else if (caseDetail.petitionPaymentStatus === PAYMENT_STATUS.WAIVED) {
    paymentDate = applicationContext
      .getUtilities()
      .formatDateString(caseDetail.petitionPaymentWaivedDate, 'MM/DD/YY');
  }
  result.filingFee = `${caseDetail.petitionPaymentStatus} ${paymentDate} ${paymentMethod}`;

  const caseEntity = new Case(caseDetail, { applicationContext });
  result.canConsolidate = caseEntity.canConsolidate();
  result.canUnconsolidate = !!caseEntity.leadDocketNumber;
  result.irsSendDate = caseEntity.getIrsSendDate();
  result.showPrintConfirmationLink =
    result.irsSendDate && !result.docketEntries.some(d => d.isLegacy);

  if (result.consolidatedCases) {
    result.consolidatedCases = result.consolidatedCases.map(
      consolidatedCase => {
        return formatCase(applicationContext, consolidatedCase);
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

// sort items that do not display a filingDate (based on createdAtFormatted) at the bottom
const sortUndefined = (a, b) => {
  if (a.createdAtFormatted && !b.createdAtFormatted) {
    return -1;
  }

  if (!a.createdAtFormatted && b.createdAtFormatted) {
    return 1;
  }
};

const sortDocketEntries = (docketEntries = [], sortByString = '') => {
  const sortFunc = getDocketRecordSortFunc(sortByString);
  const isReversed = sortByString.includes('Desc');
  docketEntries.sort(sortFunc);
  if (isReversed) {
    // reversing AFTER the sort keeps sorting stable
    return docketEntries.reverse().sort(sortUndefined);
  }
  return docketEntries.sort(sortUndefined);
};

const getFormattedCaseDetail = ({
  applicationContext,
  caseDeadlines = [],
  caseDetail,
  docketRecordSort,
}) => {
  const result = {
    ...applicationContext
      .getUtilities()
      .setServiceIndicatorsForCase(caseDetail),
    ...formatCase(applicationContext, caseDetail),
  };
  result.formattedDocketEntries = sortDocketEntries(
    result.formattedDocketEntries,
    docketRecordSort,
  );
  result.docketRecordSort = docketRecordSort;
  result.caseDeadlines = formatCaseDeadlines(applicationContext, caseDeadlines);

  result.contactPrimary = getContactPrimary(caseDetail);
  result.contactSecondary = getContactSecondary(caseDetail);

  return result;
};

module.exports = {
  TRANSCRIPT_AGE_DAYS_MIN,
  documentMeetsAgeRequirements,
  formatCase,
  formatCaseDeadlines,
  formatDocketEntry,
  getFilingsAndProceedings,
  getFormattedCaseDetail,
  sortDocketEntries,
};
