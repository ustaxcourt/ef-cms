import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setRemoteTrialPermissionModalStateAction } from '../actions/CaseDetail/setRemoteTrialPermissionModalStateAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const openEditRemoteStatusModalSequence = [
  stopShowValidationAction,
  clearModalAction,
  clearAlertsAction,
  setRemoteTrialPermissionModalStateAction,
  setShowModalFactoryAction('EditRemoteStatusModal'),
];
