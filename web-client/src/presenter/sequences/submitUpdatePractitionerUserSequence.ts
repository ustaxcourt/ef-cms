import { checkEmailAvailabilityAction } from '../actions/checkEmailAvailabilityAction';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { hasUpdatedEmailFactoryAction } from '../actions/hasUpdatedEmailFactoryAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setScrollToErrorNotificationAction } from '@web-client/presenter/actions/setScrollToErrorNotificationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { updatePractitionerUserAction } from '../actions/updatePractitionerUserAction';
import { validatePractitionerAction } from '../actions/validatePractitionerAction';
import { hasUpdatedPracticeTypeFactoryAction } from '../actions/hasUpdatedPracticeTypeFactoryAction';
import { validatePracticeTypeChangeAction } from '../actions/validatePracticeTypeChangeAction';

const afterSuccess = [
  updatePractitionerUserAction,
  {
    error: [setAlertErrorAction, unsetWaitingForResponseAction],
    success: [clearScreenMetadataAction],
  },
];

const validateEmailTasks = [
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
          setValidationErrorsAction,
          setScrollToErrorNotificationAction,
          setValidationAlertErrorsAction,
          stopShowValidationAction,
        ],
      },
    ],
  },
];

export const submitUpdatePractitionerUserSequence = [
  clearAlertsAction,
  startShowValidationAction,
  validatePractitionerAction,
  {
    error: [
      setValidationErrorsAction,
      setScrollToErrorNotificationAction,
      setValidationAlertErrorsAction,
    ],
    success: [
      hasUpdatedPracticeTypeFactoryAction('practiceType'),
      {
        yes: [
          validatePracticeTypeChangeAction,
          {
            success: validateEmailTasks,
            error: [
              setValidationErrorsAction,
              setScrollToErrorNotificationAction,
              setValidationAlertErrorsAction,
            ],
          },
        ],
        no: validateEmailTasks,
      },
    ],
  },
];
