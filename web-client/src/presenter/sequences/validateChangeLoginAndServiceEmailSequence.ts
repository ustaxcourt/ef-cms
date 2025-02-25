import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationAlertErrorsAction } from '@web-client/presenter/actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateChangeLoginAndServiceEmailAction } from '../actions/validateChangeLoginAndServiceEmailAction';

export const validateChangeLoginAndServiceEmailSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateChangeLoginAndServiceEmailAction,
      {
        error: [setValidationErrorsAction, setValidationAlertErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
