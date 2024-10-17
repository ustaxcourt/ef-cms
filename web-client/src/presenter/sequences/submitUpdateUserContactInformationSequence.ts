import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setScrollToErrorNotificationAction } from '@web-client/presenter/actions/setScrollToErrorNotificationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { updateUserContactInformationAction } from '../actions/updateUserContactInformationAction';
import { validateUserContactAction } from '../actions/validateUserContactAction';

export const submitUpdateUserContactInformationSequence = [
  clearAlertsAction,
  startShowValidationAction,
  validateUserContactAction,
  {
    error: [
      setValidationErrorsAction,
      setScrollToErrorNotificationAction,
      setValidationAlertErrorsAction,
    ],
    success: [
      setWaitingForResponseAction,
      setupCurrentPageAction('Interstitial'),
      updateUserContactInformationAction,
    ],
  },
];
