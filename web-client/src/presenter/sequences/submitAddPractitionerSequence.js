import { checkEmailAvailabilityAction } from '../actions/checkEmailAvailabilityAction';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { createPractitionerUserAction } from '../actions/createPractitionerUserAction';
import { getComputedAdmissionsDateAction } from '../actions/getComputedAdmissionsDateAction';
import { hasUpdatedEmailFactoryAction } from '../actions/hasUpdatedEmailFactoryAction';
import { navigateToPractitionerDetailAction } from '../actions/navigateToPractitionerDetailAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
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
    error: [],
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
  getComputedAdmissionsDateAction,
  validateAddPractitionerAction,
  {
    error: [setValidationErrorsAction, setValidationAlertErrorsAction],
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
