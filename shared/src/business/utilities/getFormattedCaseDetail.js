const {
  calculateISODate,
  calendarDatesCompared,
  createISODateString,
} = require('./DateHandler');
const {
  CASE_STATUS_TYPES,
  COURT_ISSUED_EVENT_CODES,
  PAYMENT_STATUS,
  TRANSCRIPT_EVENT_CODE,
} = require('../entities/EntityConstants');
const { Case } = require('../entities/cases/Case');
const { cloneDeep, isEmpty } = require('lodash');
const { ROLES } = require('../entities/EntityConstants');

const courtIssuedDocumentTypes = COURT_ISSUED_EVENT_CODES.map(
  courtIssuedDoc => courtIssuedDoc.documentType,
);

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

  result.showLegacySealed = !!result.isLegacySealed;
  result.showServedAt = !!result.servedAt;
  result.isStatusServed = !!result.servedAt;
  result.isPetition =
    result.documentType === 'Petition' || result.eventCode === 'P';

  result.isCourtIssuedDocument =
    !!courtIssuedDocumentTypes.includes(result.documentType) ||
    result.documentType === 'Stipulated Decision';

  const qcWorkItems = (result.workItems || []).filter(wi => wi.isQC);

  result.qcWorkItemsCompleted = qcWorkItems.reduce((acc, wi) => {
    return acc && !!wi.completedAt;
  }, true);

  result.isInProgress =
    !result.isCourtIssuedDocument && result.isFileAttached === false;

  result.isNotServedCourtIssuedDocument =
    result.isCourtIssuedDocument && !result.servedAt;

  result.isTranscript = result.eventCode === TRANSCRIPT_EVENT_CODE;

  result.qcWorkItemsUntouched =
    !!qcWorkItems.length &&
    qcWorkItems.reduce((acc, wi) => {
      return acc && !wi.isRead && !wi.completedAt;
    }, true);

  // Served parties code - R = Respondent, P = Petitioner, B = Both
  if (result.servedParties && result.servedParties.length > 0) {
    if (
      result.servedParties.length === 1 &&
      result.servedParties[0].role === ROLES.irsSuperuser
    ) {
      result.servedPartiesCode = 'R';
    } else {
      result.servedPartiesCode = 'B';
    }
  } else {
    // TODO: Address Respondent and Petitioner codes
    result.servedPartiesCode = '';
  }

  return result;
};

const formatDocketRecord = (applicationContext, docketRecord) => {
  const result = cloneDeep(docketRecord);
  result.createdAtFormatted = applicationContext
    .getUtilities()
    .formatDateString(result.filingDate, 'MMDDYY');

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

const formatDocketRecordWithDocument = (
  applicationContext,
  docketRecords,
  documents = [],
) => {
  const documentMap = documents.reduce((acc, document) => {
    acc[document.documentId] = document;
    return acc;
  }, {});

  return docketRecords.map(record => {
    let formattedDocument;

    const { index } = record;

    if (record.documentId && documentMap[record.documentId]) {
      formattedDocument = formatDocument(
        applicationContext,
        documentMap[record.documentId],
      );

      if (
        formattedDocument.isCourtIssuedDocument &&
        !formattedDocument.servedAt
      ) {
        record.createdAtFormatted = undefined;
      }

      record.isAvailableToUser = documentMeetsAgeRequirements(
        documentMap[record.documentId],
      );

      record.filingsAndProceedings = getFilingsAndProceedings(
        formattedDocument,
      );

      if (formattedDocument.additionalInfo) {
        record.description += ` ${formattedDocument.additionalInfo}`;
      }

      if (formattedDocument.lodged) {
        record.eventCode = 'MISCL';
      }
    }

    return { document: formattedDocument, index, record };
  });
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
      formattedDocument.objections === 'Yes'
        ? '(Objection)'
        : formattedDocument.objections === 'No'
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
  const formatCaseEntity = new Case(caseDetail, { applicationContext });
  const result = cloneDeep(caseDetail);

  result.docketRecordWithDocument = [];

  if (result.documents) {
    result.documents = result.documents.map(d =>
      formatDocument(applicationContext, d),
    );
  }

  if (result.docketRecord) {
    result.docketRecord = result.docketRecord.map(d =>
      formatDocketRecord(applicationContext, d),
    );
    result.docketRecordWithDocument = formatDocketRecordWithDocument(
      applicationContext,
      result.docketRecord,
      result.documents,
    );
  }

  result.pendingItemsDocketEntries = result.docketRecordWithDocument.filter(
    entry => entry.document && entry.document.pending,
  );

  result.draftDocuments = (result.documents || [])
    .filter(document => formatCaseEntity.isDocumentDraft(document.documentId))
    .map(document => ({
      ...document,
      editUrl:
        document.documentType === 'Stipulated Decision'
          ? `/case-detail/${caseDetail.docketNumber}/documents/${document.documentId}/sign`
          : document.documentType === 'Miscellaneous'
          ? `/case-detail/${caseDetail.docketNumber}/edit-upload-court-issued/${document.documentId}`
          : `/case-detail/${caseDetail.docketNumber}/edit-order/${document.documentId}`,
      signUrl:
        document.documentType === 'Stipulated Decision'
          ? `/case-detail/${caseDetail.docketNumber}/documents/${document.documentId}/sign`
          : `/case-detail/${caseDetail.docketNumber}/edit-order/${document.documentId}/sign`,
      signedAtFormatted: applicationContext
        .getUtilities()
        .formatDateString(document.signedAt, 'MMDDYY'),
      signedAtFormattedTZ: applicationContext
        .getUtilities()
        .formatDateString(document.signedAt, 'DATE_TIME_TZ'),
    }));

  if (result.correspondence && result.correspondence.length) {
    result.correspondence.forEach(doc => {
      doc.formattedFilingDate = applicationContext
        .getUtilities()
        .formatDateString(doc.filingDate, 'MMDDYY');
    });
  }
  // establish an initial sort by ascending index
  result.docketRecordWithDocument.sort((a, b) => {
    return a.index - b.index;
  });

  const formatCounsel = counsel => {
    let formattedName = counsel.name;
    if (counsel.barNumber) {
      formattedName += ` (${counsel.barNumber})`;
    }
    counsel.formattedName = formattedName;
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

  result.showCaseTitleForPrimary = !(
    caseDetail.contactSecondary && caseDetail.contactSecondary.name
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
    result.leadCaseId && result.leadCaseId !== result.caseId
  );

  result.isLeadCase = !!(
    result.leadCaseId && result.leadCaseId === result.caseId
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
  result.canUnconsolidate = !!caseEntity.leadCaseId;
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

const getDocketRecordSortFunc = sortBy => {
  const byIndex = (a, b) => a.index - b.index;
  const byDate = (a, b) => {
    const compared = calendarDatesCompared(
      a.record.filingDate,
      b.record.filingDate,
    );
    if (compared === 0) {
      return byIndex(a, b);
    }
    return compared;
  };

  switch (sortBy) {
    case 'byIndex': // fall-through
    case 'byIndexDesc':
      return byIndex;
    case 'byDate': // fall through, is the default sort method
    case 'byDateDesc':
    default:
      return byDate;
  }
};

const sortDocketRecords = (docketRecords = [], sortBy = '') => {
  const sortFunc = getDocketRecordSortFunc(sortBy);
  const isReversed = sortBy.includes('Desc');
  const result = docketRecords.sort(sortFunc);
  if (isReversed) {
    // reversing AFTER the sort keeps sorting stable
    return result.reverse();
  }
  return result;
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
  result.docketRecordWithDocument = sortDocketRecords(
    result.docketRecordWithDocument,
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
  formatDocketRecord,
  formatDocketRecordWithDocument,
  formatDocument,
  getFilingsAndProceedings,
  getFormattedCaseDetail,
  sortDocketRecords,
};
