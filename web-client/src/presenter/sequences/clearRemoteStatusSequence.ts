import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearRemoteStatusAction } from '../actions/CaseDetail/clearRemoteStatusAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const clearRemoteStatusSequence = [
  clearRemoteStatusAction,
  stopShowValidationAction,
  clearAlertsAction,
];
