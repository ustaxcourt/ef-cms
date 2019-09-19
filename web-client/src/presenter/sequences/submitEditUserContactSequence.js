import { clearAlertsAction } from '../actions/clearAlertsAction';
import { navigateToDashboardAction } from '../actions/navigateToDashboardAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { updateUserContactAction } from '../actions/updateUserContactAction';
import { validateUserContactAction } from '../actions/validateUserContactAction';

export const submitEditUserContactSequence = [
  clearAlertsAction,
  startShowValidationAction,
  validateUserContactAction,
  {
    error: [setValidationErrorsAction, setValidationAlertErrorsAction],
    success: [
      setWaitingForResponseAction,
      updateUserContactAction,
      {
        noChange: [navigateToDashboardAction],
        success: [
          setAlertSuccessAction,
          setCurrentPageAction('Interstitial'),
          navigateToDashboardAction,
        ],
      },
      unsetWaitingForResponseAction,
    ],
  },
];
