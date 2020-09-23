const {
  calculateISODate,
  calendarDatesCompared,
  createISODateString,
} = require('./DateHandler');
const {
  CASE_STATUS_TYPES,
  COURT_ISSUED_DOCUMENT_TYPES,
  OBJECTIONS_OPTIONS_MAP,
  PAYMENT_STATUS,
  SERVED_PARTIES_CODES,
  TRANSCRIPT_EVENT_CODE,
  UNSERVABLE_EVENT_CODES,
} = require('../entities/EntityConstants');
const { Case } = require('../entities/cases/Case');
const { cloneDeep, isEmpty } = require('lodash');
const { ROLES } = require('../entities/EntityConstants');

const getServedPartiesCode = servedParties => {
  let servedPartiesCode = '';
  if (servedParties && servedParties.length > 0) {
    if (
      servedParties.length === 1 &&
      servedParties[0].role === ROLES.irsSuperuser
    ) {
      servedPartiesCode = SERVED_PARTIES_CODES.RESPONDENT;
    } else {
      servedPartiesCode = SERVED_PARTIES_CODES.BOTH;
    }
  }
  return servedPartiesCode;
};

const formatDocument = (applicationContext, document) => {
  const result = cloneDeep(document);

  result.createdAtFormatted = applicationContext
    .getUtilities()
    .formatDateString(result.createdAt, 'MMDDYY');

  result.servedAtFormatted = applicationContext
    .getUtilities()
    .formatDateString(result.servedAt, 'MMDDYY');

  result.signedAtFormatted = applicationContext
    .getUtilities()
    .formatDateString(result.signedAt, 'MMDDYY');

  result.signedAtFormattedTZ = applicationContext
    .getUtilities()
    .formatDateString(result.signedAt, 'DATE_TIME_TZ');

  if (result.certificateOfServiceDate) {
    result.certificateOfServiceDateFormatted = applicationContext
      .getUtilities()
      .formatDateString(result.certificateOfServiceDate, 'MMDDYY');
  }
  if (result.lodged) {
    result.eventCode = 'MISCL';
  }
  result.showLegacySealed = !!result.isLegacySealed;
  result.showServedAt = !!result.servedAt;
  result.isStatusServed = !!result.servedAt;
  result.isPetition =
    result.documentType === 'Petition' || result.eventCode === 'P';

  result.isCourtIssuedDocument = !!COURT_ISSUED_DOCUMENT_TYPES.includes(
    result.documentType,
  );

  const qcWorkItem = result.workItem;

  result.qcWorkItemsCompleted = !!(qcWorkItem && qcWorkItem.completedAt);

  result.isUnservable =
    UNSERVABLE_EVENT_CODES.includes(document.eventCode) ||
    document.isLegacyServed;

  result.isInProgress =
    (!result.isCourtIssuedDocument &&
      result.isFileAttached === false &&
      !result.isMinuteEntry &&
      !result.isUnservable) ||
    (result.isFileAttached === true &&
      !result.servedAt &&
      !result.isUnservable);

  result.isNotServedDocument = !result.servedAt && !result.isLegacyServed;

  result.isTranscript = result.eventCode === TRANSCRIPT_EVENT_CODE;

  result.qcWorkItemsUntouched =
    qcWorkItem && !qcWorkItem.isRead && !qcWorkItem.completedAt;

  // Served parties code - R = Respondent, P = Petitioner, B = Both
  result.servedPartiesCode = getServedPartiesCode(result.servedParties);

  return result;
};

const TRANSCRIPT_AGE_DAYS_MIN = 90;
const documentMeetsAgeRequirements = document => {
  const transcriptCodes = [TRANSCRIPT_EVENT_CODE];
  const isTranscript = transcriptCodes.includes(document.eventCode);
  if (!isTranscript) return true;
  const availableOnDate = calculateISODate({
    dateString: document.secondaryDate,
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

const formatDocketEntry = (applicationContext, docketEntry) => {
  const formattedEntry = cloneDeep(docketEntry);

  const formattedDocument = formatDocument(applicationContext, formattedEntry);

  if (
    formattedDocument.isCourtIssuedDocument &&
    !formattedDocument.servedAt &&
    !formattedDocument.isUnservable
  ) {
    formattedEntry.createdAtFormatted = undefined;
  } else {
    formattedEntry.createdAtFormatted = applicationContext
      .getUtilities()
      .formatDateString(formattedEntry.filingDate, 'MMDDYY');
  }

  formattedEntry.isAvailableToUser = documentMeetsAgeRequirements(
    formattedEntry,
  );

  formattedEntry.filingsAndProceedings = getFilingsAndProceedings(
    formattedDocument,
  );

  if (formattedDocument.additionalInfo) {
    formattedEntry.description += ` ${formattedDocument.additionalInfo}`;
  }

  if (formattedEntry.lodged) {
    formattedEntry.eventCode = 'MISCL';
  }

  return { ...formattedDocument, ...formattedEntry };
};

const getFilingsAndProceedings = formattedDocument => {
  //filings and proceedings string
  //(C/S 04/17/2019) (Exhibit(s)) (Attachment(s)) (Objection) (Lodged)
  const filingsAndProceedingsArray = [
    `${
      formattedDocument.certificateOfService
        ? `(C/S ${formattedDocument.certificateOfServiceDateFormatted})`
        : ''
    }`,
    `${formattedDocument.exhibits ? '(Exhibit(s))' : ''}`,
    `${formattedDocument.attachments ? '(Attachment(s))' : ''}`,
    `${
      formattedDocument.objections === OBJECTIONS_OPTIONS_MAP.YES
        ? '(Objection)'
        : formattedDocument.objections === OBJECTIONS_OPTIONS_MAP.NO
        ? '(No Objection)'
        : ''
    }`,
    `${formattedDocument.lodged ? '(Lodged)' : ''}`,
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

const formatCase = (applicationContext, caseDetail) => {
  if (isEmpty(caseDetail)) {
    return {};
  }
  const result = cloneDeep(caseDetail);

  if (result.docketEntries) {
    result.draftDocuments = result.docketEntries
      .filter(document => document.isDraft && !document.archived)
      .map(document => ({
        ...formatDocument(applicationContext, document),
        editUrl:
          document.documentType === 'Miscellaneous'
            ? `/case-detail/${caseDetail.docketNumber}/edit-upload-court-issued/${document.documentId}`
            : `/case-detail/${caseDetail.docketNumber}/edit-order/${document.documentId}`,
        signUrl: `/case-detail/${caseDetail.docketNumber}/edit-order/${document.documentId}/sign`,
        signedAtFormatted: applicationContext
          .getUtilities()
          .formatDateString(document.signedAt, 'MMDDYY'),
        signedAtFormattedTZ: applicationContext
          .getUtilities()
          .formatDateString(document.signedAt, 'DATE_TIME_TZ'),
      }));

    result.formattedDocketEntries = result.docketEntries.map(d =>
      formatDocketEntry(applicationContext, d),
    );
    // establish an initial sort by ascending index
    result.formattedDocketEntries.sort(byIndexSortFunction);

    result.pendingItemsDocketEntries = result.formattedDocketEntries.filter(
      entry => entry.pending,
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
      counsel.representingNames = [];

      if (counsel.representing.includes(caseDetail.contactPrimary.contactId)) {
        counsel.representingNames.push({
          name: caseDetail.contactPrimary.name,
          secondaryName: caseDetail.contactPrimary.secondaryName,
          title: caseDetail.contactPrimary.title,
        });
      }

      if (
        caseDetail.contactSecondary &&
        counsel.representing.includes(caseDetail.contactSecondary.contactId)
      ) {
        counsel.representingNames.push({
          name: caseDetail.contactSecondary.name,
          secondaryName: caseDetail.contactSecondary.secondaryName,
          title: caseDetail.contactSecondary.title,
        });
      }

      caseDetail.otherPetitioners.forEach(otherPetitioner => {
        if (counsel.representing.includes(otherPetitioner.contactId)) {
          counsel.representingNames.push({
            name: otherPetitioner.name,
            secondaryName: otherPetitioner.secondaryName,
            title: otherPetitioner.title,
          });
        }
      });

      caseDetail.otherFilers.forEach(otherFiler => {
        if (counsel.representing.includes(otherFiler.contactId)) {
          counsel.representingNames.push({
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

  result.formattedPreferredTrialCity =
    result.preferredTrialCity || 'No location selected';

  if (result.trialSessionId && result.status !== CASE_STATUS_TYPES.closed) {
    if (result.status === CASE_STATUS_TYPES.calendared) {
      result.showTrialCalendared = true;
    } else {
      result.showScheduled = true;
    }
    result.formattedTrialCity = result.trialLocation || 'Not assigned';
    result.formattedAssociatedJudge = result.associatedJudge || 'Not assigned';
    if (result.trialDate) {
      if (result.trialTime) {
        result.formattedTrialDate = applicationContext
          .getUtilities()
          .formatDateString(result.trialDate, 'YYYY-MM-DD');
        result.formattedTrialDate += `T${result.trialTime}:00`;
        result.formattedTrialDate = applicationContext
          .getUtilities()
          .formatDateString(result.formattedTrialDate, 'DATE_TIME');
      } else {
        result.formattedTrialDate = applicationContext
          .getUtilities()
          .formatDateString(result.trialDate, 'MMDDYY');
      }
    } else {
      result.formattedTrialDate = 'Not scheduled';
    }
  } else if (result.blocked || result.automaticBlocked) {
    result.showBlockedFromTrial = true;
    if (result.blocked) {
      result.blockedDateFormatted = applicationContext
        .getUtilities()
        .formatDateString(result.blockedDate, 'MMDDYY');
    }
    if (result.automaticBlocked) {
      result.automaticBlockedDateFormatted = applicationContext
        .getUtilities()
        .formatDateString(result.automaticBlockedDate, 'MMDDYY');
      if (result.highPriority) {
        result.showAutomaticBlockedAndHighPriority = true;
      }
    }
  } else if (result.highPriority) {
    result.formattedTrialDate = 'Not scheduled';
    result.formattedAssociatedJudge = 'Not assigned';
    result.showPrioritized = true;
  } else {
    result.showNotScheduled = true;
  }

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
    return -1;
  } else if (!b.index) {
    return 1;
  }
  return a.index - b.index;
};

const getDocketRecordSortFunc = sortBy => {
  const byDate = (a, b) => {
    const compared = calendarDatesCompared(a.filingDate, b.filingDate);
    if (compared === 0) {
      return byIndexSortFunction(a, b);
    }
    return compared;
  };

  switch (sortBy) {
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

const sortDocketEntries = (docketEntries = [], sortBy = '') => {
  const sortFunc = getDocketRecordSortFunc(sortBy);
  const isReversed = sortBy.includes('Desc');
  const result = docketEntries.sort(sortFunc);
  if (isReversed) {
    // reversing AFTER the sort keeps sorting stable
    return result.reverse().sort(sortUndefined);
  }
  return result.sort(sortUndefined);
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
  return result;
};

module.exports = {
  TRANSCRIPT_AGE_DAYS_MIN,
  documentMeetsAgeRequirements,
  formatCase,
  formatCaseDeadlines,
  formatDocketEntry,
  formatDocument,
  getFilingsAndProceedings,
  getFormattedCaseDetail,
  getServedPartiesCode,
  sortDocketEntries,
};
