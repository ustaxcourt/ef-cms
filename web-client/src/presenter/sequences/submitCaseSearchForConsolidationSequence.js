import { caseExistsAction } from '../actions/caseExistsAction';
import { setCaseModalSearchAction } from '../actions/caseConsolidation/setCaseModalSearchAction';
import { setDocketNumberFromModalSearchAction } from '../actions/caseConsolidation/setDocketNumberFromModalSearchAction';
import { setNoCaseFoundModalSearchAction } from '../actions/caseConsolidation/setNoCaseFoundModalSearchAction';

export const submitCaseSearchForConsolidationSequence = [
  setDocketNumberFromModalSearchAction,
  caseExistsAction,
  {
    error: [setNoCaseFoundModalSearchAction],
    success: [setCaseModalSearchAction],
  },
];
