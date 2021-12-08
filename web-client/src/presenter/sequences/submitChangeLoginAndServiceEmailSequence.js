import { checkEmailAvailabilityAction } from '../actions/checkEmailAvailabilityAction';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setUserAction } from '../actions/setUserAction';
import { setUserPermissionsAction } from '../actions/setUserPermissionsAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { updateUserPendingEmailAction } from '../actions/updateUserPendingEmailAction';
import { validateChangeLoginAndServiceEmailAction } from '../actions/validateChangeLoginAndServiceEmailAction';

export const submitChangeLoginAndServiceEmailSequence = [
  clearAlertsAction,
  startShowValidationAction,
  validateChangeLoginAndServiceEmailAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      setValidationAlertErrorsAction,
    ],
    success: showProgressSequenceDecorator([
      checkEmailAvailabilityAction,
      {
        emailAvailable: [
          updateUserPendingEmailAction,
          setUserAction,
          setUserPermissionsAction,
          setShowModalFactoryAction('VerifyNewEmailModal'),
        ],
        emailInUse: [
          clearAlertsAction,
          setAlertErrorAction,
          setValidationErrorsAction,
          setValidationAlertErrorsAction,
          stopShowValidationAction,
        ],
      },
    ]),
  },
];
