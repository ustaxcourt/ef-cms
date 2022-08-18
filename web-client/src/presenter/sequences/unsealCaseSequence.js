import { clearModalAction } from '../actions/clearModalAction';
import { getConsolidatedCasesByCaseAction } from '../actions/CaseConsolidation/getConsolidatedCasesByCaseAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setConsolidatedCasesForCaseAction } from '../actions/CaseConsolidation/setConsolidatedCasesForCaseAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { unsealCaseAction } from '../actions/CaseDetail/unsealCaseAction';

export const unsealCaseSequence = showProgressSequenceDecorator([
  unsealCaseAction,
  {
    error: [setAlertErrorAction],
    success: [setAlertSuccessAction, setCaseAction],
  },
  clearModalAction,
  getConsolidatedCasesByCaseAction,
  setConsolidatedCasesForCaseAction,
]);
