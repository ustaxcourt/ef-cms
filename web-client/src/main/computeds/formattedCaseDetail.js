import _ from 'lodash';
import { state } from 'cerebral';

const formatCase = caseRecord => {
  const formatted = Object.assign({}, caseRecord);
  formatted.docketNumber = _.trimStart(formatted.docketNumber, '0');
  return formatted;
};

export const formattedCases = get => {
  const cases = get(state.cases);
  return cases.map(formatCase);
};
export const formattedCaseDetail = get => {
  const caseRecord = get(state.caseDetail);
  return formatCase(caseRecord);
};
