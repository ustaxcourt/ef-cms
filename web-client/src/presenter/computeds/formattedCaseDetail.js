import _ from 'lodash';
import { state } from 'cerebral';
import moment from 'moment';

export const formatDocument = document => {
  const result = _.cloneDeep(document);
  result.createdAtFormatted = moment(result.createdAt).format('L');
  result.showValidationInput = !result.reviewDate;
  result.isStatusServed = result.status === 'served';
  result.isPetition = result.documentType === 'Petition';
  return result;
};

const processArrayErrors = (yearAmount, caseDetailErrors, idx) => {
  const yearAmountError = (caseDetailErrors.yearAmounts || []).find(error => {
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
  const formattedYear = moment(yearAmount.year, 'YYYY').format('YYYY');
  yearAmount.formattedYear = formattedYear;
  yearAmount.showError = false;
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
    caseDetail.yearAmountsFormatted = [{ year: '', amount: '' }];
  } else {
    caseDetail.yearAmountsFormatted = caseDetail.yearAmounts.map(
      formatYearAmount(caseDetailErrors, caseDetail),
    );
  }
};

const formatCase = (caseDetail, caseDetailErrors) => {
  const result = _.cloneDeep(caseDetail);

  if (result.documents) result.documents = result.documents.map(formatDocument);
  if (result.respondent)
    result.respondent.formattedName = `${result.respondent.name} ${
      result.respondent.barNumber
    }`;

  result.createdAtFormatted = moment(result.createdAt).format('L');
  result.irsDateFormatted = moment(result.irsDate).format('L LT');
  result.payGovDateFormatted = moment(result.payGovDate).format('L');

  result.docketNumberWithSuffix = `${
    result.docketNumber
  }${result.docketNumberSuffix || ''}`;

  result.irsNoticeDateFormatted = result.irsNoticeDate
    ? moment.utc(result.irsNoticeDate).format('L')
    : 'No Date Provided';

  result.datePetitionSentToIrsMessage = `Respondent served ${
    result.irsDateFormatted
  }`;

  formatYearAmounts(result, caseDetailErrors);

  result.status =
    result.status === 'general' ? 'general docket' : result.status;

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
