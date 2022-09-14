import { clearModalAction } from '../actions/clearModalAction';
import { getConsolidatedCasesByCaseAction } from '../actions/CaseConsolidation/getConsolidatedCasesByCaseAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setConsolidatedCasesForCaseAction } from '../actions/CaseConsolidation/setConsolidatedCasesForCaseAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { unprioritizeCaseAction } from '../actions/CaseDetail/unprioritizeCaseAction';

export const unprioritizeCaseSequence = showProgressSequenceDecorator([
  unprioritizeCaseAction,
  setAlertSuccessAction,
  clearModalAction,
  setCaseAction,
  getConsolidatedCasesByCaseAction,
  setConsolidatedCasesForCaseAction,
]);
