import { checkEmailAvailabilityAction } from '../actions/checkEmailAvailabilityAction';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getComputedAdmissionsDateAction } from '../actions/getComputedAdmissionsDateAction';
import { hasUpdatedEmailFactoryAction } from '../actions/hasUpdatedEmailFactoryAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setPractitionerDetailAction } from '../actions/setPractitionerDetailAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { startWebSocketConnectionAction } from '../actions/webSocketConnection/startWebSocketConnectionAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { updatePractitionerUserAction } from '../actions/updatePractitionerUserAction';
import { validatePractitionerAction } from '../actions/validatePractitionerAction';

const afterSuccess = [
  startWebSocketConnectionAction,
  {
    error: [
      unsetWaitingForResponseAction,
      setShowModalFactoryAction('WebSocketErrorModal'),
    ],
    success: [
      updatePractitionerUserAction,
      {
        error: [setAlertErrorAction, unsetWaitingForResponseAction],
        success: [setPractitionerDetailAction, clearScreenMetadataAction],
      },
    ],
  },
];

export const submitUpdatePractitionerUserSequence = [
  clearAlertsAction,
  startShowValidationAction,
  getComputedAdmissionsDateAction,
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
