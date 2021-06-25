import { clearModalAction } from '../actions/clearModalAction';
import { sealCaseAction } from '../actions/CaseDetail/sealCaseAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const sealCaseSequence = showProgressSequenceDecorator([
  sealCaseAction,
  { error: [], success: [setAlertSuccessAction, setCaseAction] },
  clearModalAction,
]);
