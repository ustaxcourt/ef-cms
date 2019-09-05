import { state } from 'cerebral';
import _ from 'lodash';

export const formatDocument = (applicationContext, document) => {
  const result = _.cloneDeep(document);
  result.createdAtFormatted = applicationContext
    .getUtilities()
    .formatDateString(result.createdAt, 'MMDDYY');

  result.servedAtFormatted = applicationContext
    .getUtilities()
    .formatDateString(result.servedAt, 'DATE_TIME');

  result.showServedAt = !!result.servedAt;
  result.isStatusServed = result.status === 'served';
  result.isPetition = result.documentType === 'Petition';

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
  const result = _.cloneDeep(docketRecord);
  result.createdAtFormatted = applicationContext
    .getUtilities()
    .formatDateString(result.filingDate, 'MMDDYY');

  return result;
};

const formatCaseDeadline = (applicationContext, caseDeadline) => {
  const result = _.cloneDeep(caseDeadline);
  result.deadlineDateFormatted = applicationContext
    .getUtilities()
    .formatDateString(result.deadlineDate, 'MMDDYY');

  //use the app context utility function so the time zones match when comparing dates
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
    let document;

    const { index } = record;

    if (record.documentId) {
      document = documentMap[record.documentId];

      if (document.certificateOfServiceDate) {
        document.certificateOfServiceDateFormatted = applicationContext
          .getUtilities()
          .formatDateString(document.certificateOfServiceDate, 'MMDDYY');
      }

      record.filingsAndProceedings = getFilingsAndProceedings(document);

      if (document.additionalInfo) {
        record.description += ` ${document.additionalInfo}`;
      }
    }

    return { document, index, record };
  });
};

export const getFilingsAndProceedings = document => {
  //filings and proceedings string
  //(C/S 04/17/2019) (Exhibit(s)) (Attachment(s)) (Objection) (Lodged)
  const filingsAndProceedingsArray = [
    `${
      document.certificateOfService
        ? `(C/S ${document.certificateOfServiceDateFormatted})`
        : ''
    }`,
    `${document.exhibits ? '(Exhibit(s))' : ''}`,
    `${document.attachments ? '(Attachment(s))' : ''}`,
    `${
      document.objections === 'Yes'
        ? '(Objection)'
        : document.objections === 'No'
        ? '(No Objection)'
        : ''
    }`,
    `${document.lodged ? '(Lodged)' : ''}`,
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
  if (_.isEmpty(caseDetail)) {
    return {};
  }
  const result = _.cloneDeep(caseDetail);
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

  const { ORDER_TYPES_MAP } = applicationContext.getConstants();

  result.draftDocuments = result.documents.filter(
    document =>
      (document.documentType === 'Stipulated Decision' &&
        !document.documentType.signedAt) ||
      (!document.servedAt &&
        ORDER_TYPES_MAP.find(
          order => order.documentType === document.documentType,
        )),
  );

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

  result.formattedTrialCity = result.preferredTrialCity || 'Not assigned';
  result.formattedTrialDate = 'Not scheduled';
  result.formattedTrialJudge = 'Not assigned';

  if (result.trialSessionId) {
    result.formattedTrialCity = result.trialLocation || 'Not assigned';
    result.formattedTrialJudge = result.trialJudge || 'Not assigned';
    result.formattedTrialDate = applicationContext
      .getUtilities()
      .formatDateString(result.trialDate, 'YYYY-MM-DD');
    if (result.trialTime) {
      result.formattedTrialDate += `T${result.trialTime}:00`;
      result.formattedTrialDate = applicationContext
        .getUtilities()
        .formatDateString(result.formattedTrialDate, 'DATE_TIME');
    } else {
      result.formattedTrialDate = applicationContext
        .getUtilities()
        .formatDateString(result.formattedTrialDate, 'MMDDYY');
    }
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
    // treat as equal timestamps
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

export const formattedCases = (get, applicationContext) => {
  const cases = get(state.cases);
  return cases.map(myCase => formatCase(applicationContext, myCase));
};

export const formattedCaseDetail = (get, applicationContext) => {
  let docketRecordSort;
  const caseDetail = get(state.caseDetail);
  const caseDeadlines = get(state.caseDeadlines);
  const caseId = get(state.caseDetail.caseId);
  if (caseId) {
    docketRecordSort = get(state.sessionMetadata.docketRecordSort[caseId]);
  }
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
