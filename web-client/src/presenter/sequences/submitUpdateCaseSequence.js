import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { updateCaseAction } from '../actions/updateCaseAction';

export const submitUpdateCaseSequence = [
  clearAlertsAction,
  clearFormAction,
  clearScreenMetadataAction,
  updateCaseAction,
  setCaseAction,
  setAlertSuccessAction,
];
