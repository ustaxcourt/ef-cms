const { Case } = require('../entities/cases/Case');
const { cloneDeep, isEmpty } = require('lodash');
const { Document } = require('../entities/Document');
const { Order } = require('../entities/orders/Order');

const orderDocumentTypes = Order.ORDER_TYPES.map(
  orderType => orderType.documentType,
);
const courtIssuedDocumentTypes = Document.COURT_ISSUED_EVENT_CODES.map(
  courtIssuedDoc => courtIssuedDoc.documentType,
);

const formatDocument = (applicationContext, document) => {
  const result = cloneDeep(document);
  result.createdAtFormatted = applicationContext
    .getUtilities()
    .formatDateString(result.createdAt, 'MMDDYY');

  result.servedAtFormatted = applicationContext
    .getUtilities()
    .formatDateString(result.servedAt, 'DATE_TIME');

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

  result.showServedAt = !!result.servedAt;
  result.isStatusServed = result.status === 'served';
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

  result.qcWorkItemsUntouched =
    !!qcWorkItems.length &&
    qcWorkItems.reduce((acc, wi) => {
      return acc && !wi.isRead && !wi.completedAt;
    }, true);

  // Served parties code - R = Respondent, P = Petitioner, B = Both
  if (
    result.isStatusServed &&
    !!result.servedAt &&
    result.servedParties &&
    result.servedParties.length > 0
  ) {
    result.servedPartiesCode = 'B';
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
  docketRecords = [],
  documents = [],
) => {
  const documentMap = documents.reduce((acc, document) => {
    acc[document.documentId] = document;
    return acc;
  }, {});

  return docketRecords.map(record => {
    let formattedDocument;

    const { index } = record;

    if (record.documentId) {
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

      record.filingsAndProceedings = getFilingsAndProceedings(
        formattedDocument,
      );

      if (formattedDocument.additionalInfo) {
        record.description += ` ${formattedDocument.additionalInfo}`;
      }

      formattedDocument.canEdit =
        !formattedDocument.isPetition &&
        !formattedDocument.qcWorkItemsCompleted;
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
  const result = cloneDeep(caseDetail);
  result.docketRecordWithDocument = [];

  if (result.documents)
    result.documents = result.documents.map(d =>
      formatDocument(applicationContext, d),
    );
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

  result.draftDocuments = (result.documents || []).filter(document => {
    const isNotArchived = !document.archived;
    const isNotServed = !document.servedAt;
    const isDocumentOnDocketRecord = result.docketRecord.find(
      docketEntry => docketEntry.documentId === document.documentId,
    );
    const isStipDecision = document.documentType === 'Stipulated Decision';
    const isDraftOrder = orderDocumentTypes.includes(document.documentType);
    const isCourtIssuedDocument = courtIssuedDocumentTypes.includes(
      document.documentType,
    );
    return (
      isNotArchived &&
      isNotServed &&
      (isStipDecision ||
        (isDraftOrder && !isDocumentOnDocketRecord) ||
        (isCourtIssuedDocument && !isDocumentOnDocketRecord))
    );
  });

  result.draftDocuments = result.draftDocuments.map(document => ({
    ...document,
    editUrl:
      document.documentType === 'Stipulated Decision'
        ? `/case-detail/${caseDetail.docketNumber}/documents/${document.documentId}/sign`
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

  if (result.respondents) {
    result.respondents = result.respondents.map(formatCounsel);
  }

  if (result.practitioners) {
    result.practitioners = result.practitioners.map(formatCounsel);
  }

  result.createdAtFormatted = applicationContext
    .getUtilities()
    .formatDateString(result.createdAt, 'MMDDYY');
  result.receivedAtFormatted = applicationContext
    .getUtilities()
    .formatDateString(result.receivedAt, 'MMDDYY');
  result.irsDateFormatted = applicationContext
    .getUtilities()
    .formatDateString(result.irsSendDate, 'DATE_TIME');
  result.payGovDateFormatted = applicationContext
    .getUtilities()
    .formatDateString(result.payGovDate, 'MMDDYY');

  result.docketNumberWithSuffix = `${
    result.docketNumber
  }${result.docketNumberSuffix || ''}`;

  result.irsNoticeDateFormatted = result.irsNoticeDate
    ? applicationContext
        .getUtilities()
        .formatDateString(result.irsNoticeDate, 'MMDDYY')
    : 'No notice provided';

  result.datePetitionSentToIrsMessage = result.irsDateFormatted;

  result.shouldShowIrsNoticeDate =
    result.hasVerifiedIrsNotice ||
    ((result.hasVerifiedIrsNotice === null ||
      result.hasVerifiedIrsNotice === undefined) &&
      result.hasIrsNotice);

  result.caseName = applicationContext.getCaseCaptionNames(
    caseDetail.caseCaption || '',
  );

  result.formattedPreferredTrialCity =
    result.preferredTrialCity || 'No location selected';

  if (result.trialSessionId && result.status !== Case.STATUS_TYPES.closed) {
    if (result.status === Case.STATUS_TYPES.calendared) {
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
  } else if (result.blocked) {
    result.showBlockedFromTrial = true;
    result.blockedDateFormatted = applicationContext
      .getUtilities()
      .formatDateString(result.blockedDate, 'MMDDYY');
  } else if (result.highPriority) {
    result.formattedTrialDate = 'Not scheduled';
    result.formattedAssociatedJudge = 'Not assigned';
    result.showPrioritized = true;
  } else {
    result.showNotScheduled = true;
  }

  return result;
};

const dateStringsCompared = (a, b) => {
  const simpleDatePattern = /^(\d{4}-\d{2}-\d{2})/;
  const simpleDateLength = 10; // e.g. YYYY-MM-DD

  if (a.length == simpleDateLength || b.length == simpleDateLength) {
    // at least one date has a simple format, compare only year, month, and day
    const [aSimple, bSimple] = [
      a.match(simpleDatePattern)[0],
      b.match(simpleDatePattern)[0],
    ];
    if (aSimple.localeCompare(bSimple) == 0) {
      return 0;
    }
  }

  const secondsDifference = 30 * 1000;
  const aDate = new Date(a);
  const bDate = new Date(b);
  if (Math.abs(aDate - bDate) < secondsDifference) {
    // treat as equal time stamps
    return 0;
  }
  return aDate - bDate;
};

const getDocketRecordSortFunc = sortBy => {
  const byIndex = (a, b) => a.index - b.index;
  const byDate = (a, b) =>
    dateStringsCompared(a.record.filingDate, b.record.filingDate);

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
  formatCase,
  formatCaseDeadlines,
  formatDocketRecord,
  formatDocketRecordWithDocument,
  formatDocument,
  getFilingsAndProceedings,
  getFormattedCaseDetail,
  sortDocketRecords,
};
