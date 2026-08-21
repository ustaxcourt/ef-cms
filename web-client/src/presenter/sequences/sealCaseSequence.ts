import { clearModalAction } from '../actions/clearModalAction';
import { refreshCaseMetadataAction } from '../actions/refreshCaseMetadataAction';
import { sealCaseAction } from '../actions/CaseDetail/sealCaseAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const sealCaseSequence = showProgressSequenceDecorator([
  sealCaseAction,
  {
    error: [setAlertErrorAction],
    success: [setAlertSuccessAction, refreshCaseMetadataAction],
  },
  clearModalAction,
]);
