import { caseExistsAction } from '../actions/caseExistsAction';
import { setCaseIdFromModalSearchAction } from '../actions/caseConsolidation/setCaseIdFromModalSearchAction';
import { setCaseModalSearchAction } from '../actions/caseConsolidation/setCaseModalSearchAction';
import { setNoCaseFoundModalSearchAction } from '../actions/caseConsolidation/setNoCaseFoundModalSearchAction';

export const submitCaseSearchForConsolidationSequence = [
  setCaseIdFromModalSearchAction,
  caseExistsAction,
  {
    error: [setNoCaseFoundModalSearchAction],
    success: [setCaseModalSearchAction],
  },
];
