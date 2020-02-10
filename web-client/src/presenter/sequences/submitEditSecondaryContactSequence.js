import { clearAlertsAction } from '../actions/clearAlertsAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { updateSecondaryContactAction } from '../actions/updateSecondaryContactAction';
import { validateSecondaryContactAction } from '../actions/validateSecondaryContactAction';

export const submitEditSecondaryContactSequence = [
  clearAlertsAction,
  startShowValidationAction,
  validateSecondaryContactAction,
  {
    error: [setValidationAlertErrorsAction],
    success: [
      setWaitingForResponseAction,
      updateSecondaryContactAction,
      setAlertSuccessAction,
      unsetWaitingForResponseAction,
      setSaveAlertsForNavigationAction,
      setCurrentPageAction('Interstitial'),
      navigateToCaseDetailAction,
    ],
  },
];
