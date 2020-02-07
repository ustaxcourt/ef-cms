import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { validateSecondaryContactAction } from '../actions/validateSecondaryContactAction';

export const submitEditSecondaryContactSequence = [
  clearAlertsAction,
  startShowValidationAction,
  validateSecondaryContactAction,
  {
    error: [setValidationAlertErrorsAction],
    success: [
      //TODO
    ],
  },
];
