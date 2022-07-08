import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getComputedFormDateFactoryAction } from '../actions/getComputedFormDateFactoryAction';
import { setFormDateAction } from '../actions/setFormDateAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { validateStampAction } from '../actions/ApplyStamp/validateStampAction';

export const submitStampMotionSequence = [
  startShowValidationAction,
  getComputedFormDateFactoryAction(null),
  setFormDateAction,
  validateStampAction,
  {
    error: [setValidationErrorsAction],
    success: [clearAlertsAction],
  },
];
