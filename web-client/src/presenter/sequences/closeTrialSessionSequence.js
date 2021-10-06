import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { closeTrialSessionAction } from '../actions/TrialSession/closeTrialSessionAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const closeTrialSessionSequence = showProgressSequenceDecorator([
  clearModalStateAction,
  clearModalAction,
  clearAlertsAction,
  clearScreenMetadataAction,
  closeTrialSessionAction,
  {
    error: [setAlertErrorAction],
    success: [setAlertSuccessAction],
  },
  clearModalAction,
]);
