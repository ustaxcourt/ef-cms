import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '@web-client/presenter/actions/shouldValidateAction';
import { validateStampAction } from '../actions/StampMotion/validateStampAction';

export const validateStampSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateStampAction,
      {
        error: [
          setAlertErrorAction,
          setValidationErrorsAction,
          setValidationAlertErrorsAction,
        ],
        success: [clearAlertsAction],
      },
    ],
  },
];
