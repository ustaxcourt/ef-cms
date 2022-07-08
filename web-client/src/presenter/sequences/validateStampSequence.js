import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getComputedFormDateFactoryAction } from '../actions/getComputedFormDateFactoryAction';
import { setFormDateAction } from '../actions/setFormDateAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateStampAction } from '../actions/ApplyStamp/validateStampAction';

export const validateStampSequence = [
  getComputedFormDateFactoryAction(),
  setFormDateAction,
  validateStampAction,
  {
    error: [setValidationErrorsAction],
    success: [clearAlertsAction],
  },
];
