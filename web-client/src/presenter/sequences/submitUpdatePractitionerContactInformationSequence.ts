import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setScrollToErrorNotificationAction } from '@web-client/presenter/actions/setScrollToErrorNotificationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { updatePractitionerContactInformationAction } from '../actions/updatePractitionerContactInformationAction';
import { validateUserContactAction } from '../actions/validateUserContactAction';

export const submitUpdatePractitionerContactInformationSequence = [
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
      updatePractitionerContactInformationAction,
    ],
  },
];
