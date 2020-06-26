import { getOpenAndClosedCasesByUserAction } from '../actions/caseConsolidation/getOpenAndClosedCasesByUserAction';
import { setCasesAction } from '../actions/setCasesAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const getCasesByStatusForUserSequence = showProgressSequenceDecorator([
  getOpenAndClosedCasesByUserAction,
  setCasesAction,
]);
