import { clearAlertsAction } from '../actions/clearAlertsAction';
import { navigateToDashboardAction } from '../actions/navigateToDashboardAction';
import { set } from 'cerebral/factories';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { state } from 'cerebral';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';
import { updateUserContactAction } from '../actions/updateUserContactAction';
import { validateUserContactAction } from '../actions/validateUserContactAction';

export const submitEditUserContactSequence = [
  clearAlertsAction,
  startShowValidationAction,
  validateUserContactAction,
  {
    error: [setValidationErrorsAction, setValidationAlertErrorsAction],
    success: [
      setFormSubmittingAction,
      updateUserContactAction,
      {
        noChange: [unsetFormSubmittingAction, navigateToDashboardAction],
        success: [
          setAlertSuccessAction,
          unsetFormSubmittingAction,
          setCurrentPageAction('Interstitial'),
          navigateToDashboardAction,
        ],
      },
    ],
  },
];
