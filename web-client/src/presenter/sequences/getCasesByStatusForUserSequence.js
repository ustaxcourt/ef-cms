import { getConsolidatedCasesByUserAction } from '../actions/caseConsolidation/getConsolidatedCasesByUserAction';
import { setCasesAction } from '../actions/setCasesAction';

export const getCasesByStatusForUserSequence = [
  getConsolidatedCasesByUserAction,
  setCasesAction,
];
