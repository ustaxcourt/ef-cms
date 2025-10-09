import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateRemoteTrialPermissionAction } from '../actions/CaseDetail/validateRemoteTrialPermissionAction';

export const validateEditRemoteTrialModalSequence = [
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
