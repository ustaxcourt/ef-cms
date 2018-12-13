import _ from 'lodash';
import { state } from 'cerebral';
import moment from 'moment';

const formatDocument = result => {
  result.createdAtFormatted = moment(result.createdAt).format('l');
  result.showValidationInput = !result.reviewDate;
  result.isStatusServed = result.status === 'served';
};

const formatCase = (caseDetail, form) => {
  const result = _.cloneDeep(caseDetail);

  if (result.documents) result.documents.map(formatDocument);
  if (result.respondent)
    result.respondent.formattedName = `${result.respondent.name} ${
      result.respondent.barNumber
    }`;
  result.createdAtFormatted = moment(result.createdAt).format('L');
  result.irsDateFormatted = moment(result.irsDate).format('L LT');
  result.payGovDateFormatted = moment(result.payGovDate).format('L');

  result.showDocumentStatus = !result.irsSendDate;
  result.showIrsServedDate = !!result.irsSendDate;
  result.showPayGovIdInput = form.paymentType == 'payGov';
  result.showPaymentOptions = !(caseDetail.payGovId && !form.paymentType);
  result.showActionRequired = !caseDetail.payGovId;
  result.showPaymentRecord = result.payGovId && !form.paymentType;
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
  const form = get(state.form);
  return formatCase(caseDetail, form);
};
