import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getComputedFormDateFactoryAction } from '../actions/getComputedFormDateFactoryAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setFormDateAction } from '../actions/setFormDateAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { validateStampAction } from '../actions/StampMotion/validateStampAction';

export const validateStampSequence = [
  getComputedFormDateFactoryAction(null),
  setFormDateAction,
  validateStampAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      setValidationAlertErrorsAction,
    ],
    success: [clearAlertsAction],
  },
];
