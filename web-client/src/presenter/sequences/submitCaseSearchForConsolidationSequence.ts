import { caseExistsAction } from '../actions/caseExistsAction';
import { getCaseAction } from '../actions/getCaseAction';
import { setCaseModalSearchAction } from '../actions/CaseConsolidation/setCaseModalSearchAction';
import { setDocketNumberFromModalSearchAction } from '../actions/CaseConsolidation/setDocketNumberFromModalSearchAction';
import { setNoCaseFoundModalSearchAction } from '../actions/CaseConsolidation/setNoCaseFoundModalSearchAction';

export const submitCaseSearchForConsolidationSequence = [
  setDocketNumberFromModalSearchAction,
  caseExistsAction,
  {
    error: [setNoCaseFoundModalSearchAction],
    success: [getCaseAction, setCaseModalSearchAction],
  },
];
