import _ from 'lodash';
import { state } from 'cerebral';
import moment from 'moment';

export const formatDocument = document => {
  const result = _.cloneDeep(document);
  result.createdAtFormatted = moment(result.createdAt).format('L');
  result.showValidationInput = !result.reviewDate;
  result.isStatusServed = result.status === 'served';
  return result;
};

const formatCase = caseDetail => {
  const result = _.cloneDeep(caseDetail);

  if (result.documents) result.documents = result.documents.map(formatDocument);
  if (result.respondent)
    result.respondent.formattedName = `${result.respondent.name} ${
      result.respondent.barNumber
    }`;

  result.createdAtFormatted = moment(result.createdAt).format('L');
  result.irsDateFormatted = moment(result.irsDate).format('L LT');
  result.payGovDateFormatted = moment(result.payGovDate).format('L');

  result.irsNoticeDateFormatted = result.irsNoticeDate || 'No Date Provided';

  result.datePetitionSentToIrsMessage = `Respondent served ${
    result.irsDateFormatted
  }`;

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
  return formatCase(caseDetail);
};
