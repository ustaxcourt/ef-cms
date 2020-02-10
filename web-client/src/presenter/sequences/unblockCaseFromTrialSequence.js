import { clearModalAction } from '../actions/clearModalAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { unblockCaseFromTrialAction } from '../actions/CaseDetail/unblockCaseFromTrialAction';

export const unblockCaseFromTrialSequence = showProgressSequenceDecorator([
  setWaitingForResponseAction,
  unblockCaseFromTrialAction,
  setAlertSuccessAction,
  clearModalAction,
  setCaseAction,
]);
