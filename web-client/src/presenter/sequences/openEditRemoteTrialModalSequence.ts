import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { setRemoteTrialPermissionModalStateAction } from '../actions/CaseDetail/setRemoteTrialPermissionModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const openEditRemoteTrialModalSequence = [
  stopShowValidationAction,
  clearModalAction,
  clearAlertsAction,
  setRemoteTrialPermissionModalStateAction,
  setShowModalFactoryAction('EditRemoteTrialModalDialog'),
];
