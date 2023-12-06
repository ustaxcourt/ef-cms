import { getCaseDeadlinesAction } from '../actions/CaseDeadline/getCaseDeadlinesAction';
import { setCaseDeadlinesAction } from '../actions/CaseDeadline/setCaseDeadlinesAction';

export const loadMoreCaseDeadlinesSequence = [
  getCaseDeadlinesAction,
  setCaseDeadlinesAction,
];
