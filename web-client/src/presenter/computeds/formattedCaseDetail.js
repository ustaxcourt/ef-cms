import _ from 'lodash';
import { state } from 'cerebral';
import moment from 'moment';
import { applicationContext } from '../../applicationContext';

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

const formatDocketRecordWithDocument = (docketRecords = [], documents = []) => {
  const documentMap = documents.reduce((acc, document) => {
    acc[document.documentId] = document;
    return acc;
  }, {});

  return docketRecords.map((record, index) => {
    let document;

    if (record.documentId) {
      document = documentMap[record.documentId];
    }
    return { document, index, record };
  });
};

const formatCase = (caseDetail, caseDetailErrors) => {
  const result = _.cloneDeep(caseDetail);
  result.docketRecordWithDocument = [];

  if (result.documents) result.documents = result.documents.map(formatDocument);
  if (result.docketRecord) {
    result.docketRecord = result.docketRecord.map(formatDocketRecord);
    result.docketRecordWithDocument = formatDocketRecordWithDocument(
      result.docketRecord,
      result.documents,
    );
  }

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
  result.irsDateFormatted = moment.utc(result.irsDate).format('L LT');
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

  // const postfixs = [', Petitioner', ', Petitioners', ', Petitioner(s)'];
  result.caseName = (result.caseCaption || '').replace(
    /\s*,\s*Petitioner(s|\(s\))?\s*$/,
    '',
  );

  result.caseName = applicationContext.getCaseCaptionNames(
    caseDetail.caseCaption || '',
  );

  formatYearAmounts(result, caseDetailErrors);

  return result;
};

export const formattedCases = get => {
  const cases = get(state.cases);
  return cases.map(formatCase);
};

export const formattedCaseDetail = get => {
  const caseDetail = get(state.caseDetail);
  const caseDetailErrors = get(state.caseDetailErrors);
  return formatCase(caseDetail, caseDetailErrors);
};
