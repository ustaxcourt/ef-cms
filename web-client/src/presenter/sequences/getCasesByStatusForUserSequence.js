import { getConsolidatedCasesByUserAction } from '../actions/caseConsolidation/getConsolidatedCasesByUserAction';
import { setClosedCasesAction } from '../actions/setClosedCasesAction';
import { setOpenCasesAction } from '../actions/setOpenCasesAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const getCasesByStatusForUserSequence = showProgressSequenceDecorator([
  getConsolidatedCasesByUserAction,
  setClosedCasesAction,
  setOpenCasesAction,
]);
