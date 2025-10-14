import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { updateRemoteTrialPermissionAction } from '../actions/CaseDetail/updateRemoteTrialPermissionAction';
import { validateRemoteTrialPermissionAction } from '../actions/CaseDetail/validateRemoteTrialPermissionAction';

export const submitEditRemoteTrialModalSequence = [
  startShowValidationAction,
  validateRemoteTrialPermissionAction,
  {
    error: [setValidationErrorsAction],
    success: showProgressSequenceDecorator([
      updateRemoteTrialPermissionAction,
      setAlertSuccessAction,
      clearModalAction,
      clearModalStateAction,
      setCaseAction,
    ]),
  },
];
