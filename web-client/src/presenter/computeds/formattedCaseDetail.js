import { state } from 'cerebral';
import _ from 'lodash';

export const formatDocument = (applicationContext, document) => {
  const result = _.cloneDeep(document);
  result.createdAtFormatted = applicationContext
    .getUtilities()
    .formatDateString(result.createdAt, 'MMDDYY');
  result.showValidationInput = !result.reviewDate;
  result.isStatusServed = result.status === 'served';
  result.isPetition = result.documentType === 'Petition';
  return result;
};

const formatDocketRecord = (applicationContext, docketRecord) => {
  const result = _.cloneDeep(docketRecord);
  result.createdAtFormatted = applicationContext
    .getUtilities()
    .formatDateString(result.filingDate, 'MMDDYY');

  return result;
};

const processArrayErrors = (yearAmount, caseDetailErrors, idx) => {
  const yearAmountError = caseDetailErrors.yearAmounts.find(error => {
    return error.index === idx;
  });

  if (yearAmountError) {
    yearAmount.showError = true;
    yearAmount.errorMessage = yearAmountError.year;
  }
};

const processDuplicateError = (caseDetail, caseDetailErrors) => {
  const duplicates = _.filter(caseDetail.yearAmounts, (val, i, iteratee) =>
    _.find(iteratee, (val2, i2) => {
      return val.formattedYear === val2.formattedYear && i !== i2;
    }),
  );

  duplicates.forEach(duplicate => {
    duplicate.showError = true;
    duplicate.errorMessage = caseDetailErrors.yearAmounts;
  });
};

const formatYearAmount = (applicationContext, caseDetailErrors, caseDetail) => (
  yearAmount,
  idx,
) => {
  const isoYear = applicationContext
    .getUtilities()
    .createISODateString(yearAmount.year, 'YYYY');
  const formattedYear = yearAmount.year
    ? applicationContext.getUtilities().formatDateString(isoYear, 'YYYY')
    : 'Invalid date';
  yearAmount.formattedYear = formattedYear;
  yearAmount.showError = false;
  yearAmount.amountFormatted = yearAmount.amount
    ? Number(yearAmount.amount).toLocaleString('en-US')
    : yearAmount.amount;
  if (Array.isArray(caseDetailErrors.yearAmounts)) {
    processArrayErrors(yearAmount, caseDetailErrors, idx);
  } else if (typeof caseDetailErrors.yearAmounts === 'string') {
    processDuplicateError(caseDetail, caseDetailErrors);
  }

  return {
    ...yearAmount,
    year:
      formattedYear.indexOf('Invalid') > -1 || yearAmount.year.length < 4
        ? yearAmount.year
        : formattedYear,
  };
};

export const formatYearAmounts = (
  applicationContext,
  caseDetail = {},
  caseDetailErrors = {},
) => {
  caseDetail.canAddYearAmount =
    (caseDetail.yearAmounts || []).filter(yearAmount => {
      return !yearAmount.year;
    }).length !== 1;

  if (!caseDetail.yearAmounts || caseDetail.yearAmounts.length === 0) {
    caseDetail.yearAmountsFormatted = [{ amount: '', year: '' }];
  } else {
    caseDetail.yearAmountsFormatted = caseDetail.yearAmounts.map(
      formatYearAmount(applicationContext, caseDetailErrors, caseDetail),
    );
  }
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

    const index = record.index;

    if (record.documentId) {
      document = documentMap[record.documentId];

      if (document.certificateOfServiceDate) {
        document.certificateOfServiceDateFormatted = applicationContext
          .getUtilities()
          .formatDateString(document.certificateOfServiceDate, 'MMDDYY');
      }

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
      record.filingsAndProceedings = filingsAndProceedingsArray
        .filter(item => item !== '')
        .join(' ');

      if (document.additionalInfo) {
        record.description += ` ${document.additionalInfo}`;
      }
    }

    return { document, index, record };
  });
};

const formatCase = (applicationContext, caseDetail, caseDetailErrors) => {
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

  // establish an initial sort by ascending index
  result.docketRecordWithDocument.sort((a, b) => {
    return a.index - b.index;
  });

  if (result.respondent)
    result.respondent.formattedName = `${result.respondent.name} ${
      result.respondent.barNumber || '55555' // TODO: hard coded for now until we get that info in cognito
    }`;

  if (result.practitioner) {
    let formattedName = result.practitioner.name;
    if (result.practitioner.barNumber) {
      formattedName += ` (${result.practitioner.barNumber})`;
    }
    result.practitioner.formattedName = formattedName;
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

  console.log(result.receivedAt, result.receivedAtFormatted);
  console.log(result.irsNoticeDate, result.irsNoticeDateFormatted);

  result.datePetitionSentToIrsMessage = `Respondent served ${result.irsDateFormatted}`;

  result.shouldShowIrsNoticeDate =
    result.hasVerifiedIrsNotice ||
    ((result.hasVerifiedIrsNotice === null ||
      result.hasVerifiedIrsNotice === undefined) &&
      result.hasIrsNotice);

  result.shouldShowYearAmounts =
    result.shouldShowIrsNoticeDate && result.hasVerifiedIrsNotice;

  result.caseName = applicationContext.getCaseCaptionNames(
    caseDetail.caseCaption || '',
  );

  formatYearAmounts(applicationContext, result, caseDetailErrors);

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
  const isReversed = sortBy.indexOf('Desc') > -1;
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
  const caseId = get(state.caseDetail.caseId);
  if (caseId) {
    docketRecordSort = get(state.sessionMetadata.docketRecordSort[caseId]);
  }
  const caseDetailErrors = get(state.caseDetailErrors);
  const result = formatCase(applicationContext, caseDetail, caseDetailErrors);
  result.docketRecordWithDocument = sortDocketRecords(
    result.docketRecordWithDocument,
    docketRecordSort,
  );
  result.docketRecordSort = docketRecordSort;
  return result;
};
