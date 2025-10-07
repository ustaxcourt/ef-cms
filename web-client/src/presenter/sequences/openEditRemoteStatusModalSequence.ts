import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const openEditRemoteStatusModalSequence = [
  stopShowValidationAction,
  clearModalAction,
  clearAlertsAction,
  setShowModalFactoryAction('BlockFromTrialModal'),
];
