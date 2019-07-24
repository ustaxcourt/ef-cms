import { getCaseDeadlinesForCaseAction } from '../actions/CaseDeadline/getCaseDeadlinesForCaseAction';
import { refreshCaseAction } from '../actions/refreshCaseAction';

export const refreshCaseSequence = [
  refreshCaseAction,
  getCaseDeadlinesForCaseAction,
];
