import { caseExistsAction } from '../actions/caseExistsAction';
import { setCaseIdFromSearchAction } from '../actions/setCaseIdFromSearchAction';
import { setCaseModalSearchAction } from '../actions/caseConsolidation/setCaseModalSearchAction';
import { setNoCaseFoundModalSearchAction } from '../actions/caseConsolidation/setNoCaseFoundModalSearchAction';

export const submitCaseSearchForConsolidationSequence = [
  setCaseIdFromSearchAction,
  caseExistsAction,
  {
    error: [setNoCaseFoundModalSearchAction],
    success: [setCaseModalSearchAction],
  },
];
