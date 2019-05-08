import { applicationContext } from '../../applicationContext';
import { state } from 'cerebral';
import _ from 'lodash';
import moment from 'moment';

export const formatDocument = document => {
  const result = _.cloneDeep(document);
  result.createdAtFormatted = moment.utc(result.createdAt).format('L');
  result.showValidationInput = !result.reviewDate;
  result.isStatusServed = result.status === 'served';
  result.isPetition = result.documentType === 'Petition';
  return result;
};

export const formatDocketRecord = docketRecord => {
  const result = _.cloneDeep(docketRecord);
  result.createdAtFormatted = moment.utc(result.filingDate).format('L');

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

const formatYearAmount = (caseDetailErrors, caseDetail) => (
  yearAmount,
  idx,
) => {
  const formattedYear = moment.utc(yearAmount.year, 'YYYY').format('YYYY');
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

export const formatYearAmounts = (caseDetail, caseDetailErrors = {}) => {
  caseDetail.canAddYearAmount =
    (caseDetail.yearAmounts || []).filter(yearAmount => {
      return !yearAmount.year;
    }).length !== 1;

  if (!caseDetail.yearAmounts || caseDetail.yearAmounts.length === 0) {
    caseDetail.yearAmountsFormatted = [{ amount: '', year: '' }];
  } else {
    caseDetail.yearAmountsFormatted = caseDetail.yearAmounts.map(
      formatYearAmount(caseDetailErrors, caseDetail),
    );
  }
};

const formatDocketRecordWithDocument = (
  caseDetail,
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
        document.certificateOfServiceDateFormatted = moment
          .utc(document.certificateOfServiceDate)
          .format('L');
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
    }

    return { document, index, record };
  });
};

const formatCase = (caseDetail, caseDetailErrors) => {
  if (_.isEmpty(caseDetail)) {
    return {};
  }
  const result = _.cloneDeep(caseDetail);
  result.docketRecordWithDocument = [];

  if (result.documents) result.documents = result.documents.map(formatDocument);
  if (result.docketRecord) {
    result.docketRecord = result.docketRecord.map(formatDocketRecord);
    result.docketRecordWithDocument = formatDocketRecordWithDocument(
      caseDetail,
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

  result.createdAtFormatted = moment.utc(result.createdAt).format('L');
  result.receivedAtFormatted = moment.utc(result.receivedAt).format('L');
  result.irsDateFormatted = moment
    .utc(result.irsSendDate)
    .local()
    .format('L LT');
  result.payGovDateFormatted = moment.utc(result.payGovDate).format('L');

  result.docketNumberWithSuffix = `${
    result.docketNumber
  }${result.docketNumberSuffix || ''}`;

  result.irsNoticeDateFormatted = result.irsNoticeDate
    ? moment.utc(result.irsNoticeDate).format('L')
    : 'No notice provided';

  result.datePetitionSentToIrsMessage = `Respondent served ${
    result.irsDateFormatted
  }`;

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

  formatYearAmounts(result, caseDetailErrors);

  return result;
};

const getDocketRecordSortFunc = function(sortBy) {
  const byIndex = (a, b) => a.index - b.index;
  const byDate = (a, b) => {
    const secondsDifference = 30 * 1000;
    const aDate = new Date(a.record.filingDate);
    const bDate = new Date(b.record.filingDate);
    if (Math.abs(aDate - bDate) < secondsDifference) {
      // treat as equal timestamps
      return 0;
    }
    return aDate - bDate;
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

const sortDocketRecords = (docketRecords, sortBy = '') => {
  const sortFunc = getDocketRecordSortFunc(sortBy);
  const isReversed = sortBy.indexOf('Desc') > -1;
  const result = docketRecords.sort(sortFunc);
  if (isReversed) {
    // reversing AFTER the sort keeps sorting stable
    return result.reverse();
  }
  return result;
};

export const formattedCases = get => {
  const cases = get(state.cases);
  const docketRecordSort = get(state.prefs.docketRecordSort);
  return cases.map(caseObj => {
    const result = formatCase(caseObj);
    result.docketRecordWithDocument = sortDocketRecords(
      result.docketRecordWithDocument,
      docketRecordSort,
    );
    return result;
  });
};

export const formattedCaseDetail = get => {
  const caseDetail = get(state.caseDetail);
  const docketRecordSort = get(state.prefs.docketRecordSort);
  const caseDetailErrors = get(state.caseDetailErrors);
  const result = formatCase(caseDetail, caseDetailErrors);
  result.docketRecordWithDocument = sortDocketRecords(
    result.docketRecordWithDocument,
    docketRecordSort,
  );
  return result;
};
