import { clearModalAction } from '../actions/clearModalAction';
import { refreshCaseMetadataAction } from '../actions/refreshCaseMetadataAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { unsealCaseAction } from '../actions/CaseDetail/unsealCaseAction';

export const unsealCaseSequence = showProgressSequenceDecorator([
  unsealCaseAction,
  {
    error: [setAlertErrorAction],
    success: [setAlertSuccessAction, refreshCaseMetadataAction],
  },
  clearModalAction,
]);
