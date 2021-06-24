import { clearModalAction } from '../actions/clearModalAction';
import { sealCaseAction } from '../actions/CaseDetail/sealCaseAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const sealCaseSequence = showProgressSequenceDecorator([
  sealCaseAction,
  {
    error: [setAlertErrorAction],
    success: [setAlertSuccessAction, setCaseAction],
  },
  clearModalAction,
]);
