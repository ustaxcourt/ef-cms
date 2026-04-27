import { editRemoteStatusAction } from '../actions/CaseDetail/editRemoteStatusAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { refreshCaseMetadataAction } from '../actions/refreshCaseMetadataAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { validateRemoteTrialPermissionAction } from '@web-client/presenter/actions/CaseDetail/validateRemoteTrialPermissionAction';

export const editRemoteStatusSequence = [
  startShowValidationAction,
  validateRemoteTrialPermissionAction,
  {
    error: [setValidationErrorsAction],
    success: showProgressSequenceDecorator([
      editRemoteStatusAction,
      setAlertSuccessAction,
      clearModalAction,
      clearModalStateAction,
      refreshCaseMetadataAction,
    ]),
  },
];
