import { clearModalAction } from '../actions/clearModalAction';
import { getConsolidatedCasesByCaseAction } from '../actions/CaseConsolidation/getConsolidatedCasesByCaseAction';
import { sealCaseAction } from '../actions/CaseDetail/sealCaseAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setConsolidatedCasesForCaseAction } from '../actions/CaseConsolidation/setConsolidatedCasesForCaseAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const sealCaseSequence = showProgressSequenceDecorator([
  sealCaseAction,
  {
    error: [setAlertErrorAction],
    success: [setAlertSuccessAction, setCaseAction],
  },
  clearModalAction,
  getConsolidatedCasesByCaseAction,
  setConsolidatedCasesForCaseAction,
]);
