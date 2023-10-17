import { clearModalAction } from '../actions/clearModalAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { unsealCaseAction } from '../actions/CaseDetail/unsealCaseAction';

export const unsealCaseSequence = showProgressSequenceDecorator([
  unsealCaseAction,
  {
    error: [setAlertErrorAction],
    success: [setAlertSuccessAction, setCaseAction],
  },
  clearModalAction,
]);
