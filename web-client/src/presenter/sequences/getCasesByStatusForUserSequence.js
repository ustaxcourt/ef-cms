import { getConsolidatedCasesByUserAction } from '../actions/caseConsolidation/getConsolidatedCasesByUserAction';
import { setCasesAction } from '../actions/setCasesAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const getCasesByStatusForUserSequence = showProgressSequenceDecorator([
  getConsolidatedCasesByUserAction,
  setCasesAction,
]);
