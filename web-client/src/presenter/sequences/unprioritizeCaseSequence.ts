import { clearModalAction } from '../actions/clearModalAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { unprioritizeCaseAction } from '../actions/CaseDetail/unprioritizeCaseAction';

export const unprioritizeCaseSequence = showProgressSequenceDecorator([
  unprioritizeCaseAction,
  setAlertSuccessAction,
  clearModalAction,
  setCaseAction,
]);
