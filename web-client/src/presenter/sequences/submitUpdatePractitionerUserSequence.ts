import { checkEmailAvailabilityAction } from '../actions/checkEmailAvailabilityAction';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { hasUpdatedEmailFactoryAction } from '../actions/hasUpdatedEmailFactoryAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { updatePractitionerUserAction } from '../actions/updatePractitionerUserAction';
import { validatePractitionerAction } from '../actions/validatePractitionerAction';

const afterSuccess = [
  updatePractitionerUserAction,
  {
    error: [setAlertErrorAction, unsetWaitingForResponseAction],
    success: [clearScreenMetadataAction],
  },
];

export const submitUpdatePractitionerUserSequence = [
  clearAlertsAction,
  startShowValidationAction,
  validatePractitionerAction,
  {
    error: [setValidationErrorsAction, setValidationAlertErrorsAction],
    success: [
      setWaitingForResponseAction,
      hasUpdatedEmailFactoryAction('updatedEmail'),
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
