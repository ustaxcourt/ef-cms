import { clearAlertsAction } from '../actions/clearAlertsAction';
import { navigateToDashboardAction } from '../actions/navigateToDashboardAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setWaitingForResponseActiontiontion } from '../setWaitingForResponseActionseActionseAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { unsetWaitingForResponseActiontiontion } from '../acsetWaitingForResponseActionseActionseAction';
import { updateUserContactAction } from '../actions/updateUserContactAction';
import { validateUserContactAction } from '../actions/validateUserContactAction';

export const submitEditUserContactSequence = [
  clearAlertsAction,
  startShowValidationAction,
  validateUserContactAction,
  {
    error: [setValidationErrorsAction, setValidationAlertErrorsAction],
    success: [
      setWaitingForResponseActiontiontion,
      updateUserContactAction,
      {
        noChange: [
          unsetWaitingForResponseActiontiontion,
          navigateToDashboardAction,
        ],
        success: [
          setAlertSuccessAction,
          unsetWaitingForResponseActiontiontion,
          setCurrentPageAction('Interstitial'),
          navigateToDashboardAction,
        ],
      },
    ],
  },
];
