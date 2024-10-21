import { checkEmailAvailabilityAction } from '../actions/checkEmailAvailabilityAction';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { createPractitionerUserAction } from '../actions/createPractitionerUserAction';
import { hasUpdatedEmailFactoryAction } from '../actions/hasUpdatedEmailFactoryAction';
import { navigateToPractitionerDetailAction } from '../actions/navigateToPractitionerDetailAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setScrollToErrorNotificationAction } from '@web-client/presenter/actions/setScrollToErrorNotificationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { validateAddPractitionerAction } from '../actions/validateAddPractitionerAction';

const afterSuccess = [
  unsetWaitingForResponseAction,
  createPractitionerUserAction,
  {
    error: [setAlertErrorAction],
    success: [
      setAlertSuccessAction,
      setSaveAlertsForNavigationAction,
      navigateToPractitionerDetailAction,
    ],
  },
];

export const submitAddPractitionerSequence = [
  clearAlertsAction,
  startShowValidationAction,
  validateAddPractitionerAction,
  {
    error: [
      setValidationErrorsAction,
      setScrollToErrorNotificationAction,
      setValidationAlertErrorsAction,
    ],
    success: [
      setWaitingForResponseAction,
      hasUpdatedEmailFactoryAction('email'),
      {
        no: afterSuccess,
        yes: [
          checkEmailAvailabilityAction,
          {
            emailAvailable: afterSuccess,
            emailInUse: [
              setScrollToErrorNotificationAction,
              unsetWaitingForResponseAction,
              clearAlertsAction,
              setAlertErrorAction,
              setValidationErrorsAction,
              setValidationAlertErrorsAction,
              stopShowValidationAction,
            ],
          },
        ],
      },
    ],
  },
];
