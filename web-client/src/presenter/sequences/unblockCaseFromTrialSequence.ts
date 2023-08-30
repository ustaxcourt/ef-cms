import { clearModalAction } from '../actions/clearModalAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { unblockCaseFromTrialAction } from '../actions/CaseDetail/unblockCaseFromTrialAction';

export const unblockCaseFromTrialSequence = showProgressSequenceDecorator([
  unblockCaseFromTrialAction,
  setAlertSuccessAction,
  clearModalAction,
  setCaseAction,
]);
