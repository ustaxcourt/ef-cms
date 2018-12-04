import _ from 'lodash';
import { state } from 'cerebral';
import moment from 'moment';

const formatCase = caseRecord => {
  const result = _.cloneDeep(caseRecord);
  result.docketNumber = _.trimStart(result.docketNumber, '0');
  if (result.documents) {
    result.documents.map(document => {
      document.createdAtFormatted = moment(document.createdAt).format('l');
    });
  }
  result.irsDateFormatted = moment(result.irsDate).format('L');
  result.payGovDateFormatted = moment(result.payGovDate).format('L');
  return result;
};

export const formattedCases = get => {
  const cases = get(state.cases);
  return cases.map(formatCase);
};

export const formattedCaseDetail = get => {
  const caseRecord = get(state.caseDetail);
  return formatCase(caseRecord);
};
