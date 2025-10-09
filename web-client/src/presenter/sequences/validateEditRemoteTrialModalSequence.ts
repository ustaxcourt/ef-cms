import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateRemoteTrialPermissionAction } from '../actions/CaseDetail/validateRemoteTrialPermissionAction';
import { startShowValidationAction } from '@web-client/presenter/actions/startShowValidationAction';

export const validateEditRemoteTrialModalSequence = [
  startShowValidationAction,
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateRemoteTrialPermissionAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
