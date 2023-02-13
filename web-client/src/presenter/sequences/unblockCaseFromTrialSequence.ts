import { clearModalAction } from '../actions/clearModalAction';
import { getConsolidatedCasesByCaseAction } from '../actions/CaseConsolidation/getConsolidatedCasesByCaseAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setConsolidatedCasesForCaseAction } from '../actions/CaseConsolidation/setConsolidatedCasesForCaseAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { unblockCaseFromTrialAction } from '../actions/CaseDetail/unblockCaseFromTrialAction';

export const unblockCaseFromTrialSequence = showProgressSequenceDecorator([
  unblockCaseFromTrialAction,
  setAlertSuccessAction,
  clearModalAction,
  setCaseAction,
  getConsolidatedCasesByCaseAction,
  setConsolidatedCasesForCaseAction,
]);
