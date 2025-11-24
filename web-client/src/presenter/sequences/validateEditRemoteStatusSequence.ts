import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateRemoteTrialPermissionAction } from '@web-client/presenter/actions/CaseDetail/validateRemoteTrialPermissionAction';

export const validateEditRemoteStatusSequence = [
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
