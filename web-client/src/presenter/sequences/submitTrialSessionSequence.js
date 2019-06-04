import { clearAlertsAction } from '../actions/clearAlertsAction';
import { createTrialSessionAction } from '../actions/TrialSession/createTrialSessionAction';
import { getCreateTrialSessionAlertSuccessAction } from '../actions/TrialSession/getCreateTrialSessionAlertSuccessAction';
import { navigateToTrialSessionAction } from '../actions/TrialSession/navigateToTrialSessionAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
import { setTrialSessionAction } from '../actions/TrialSession/setTrialSessionAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateTrialSessionAction } from '../actions/TrialSession/validateTrialSessionAction';

export const submitTrialSessionSequence = [
  clearAlertsAction,
  startShowValidationAction,
  validateTrialSessionAction,
  {
    error: [setValidationErrorsAction],
    success: [
      stopShowValidationAction,
      setFormSubmittingAction,
      createTrialSessionAction,
      {
        error: [],
        success: [
          setTrialSessionAction,
          getCreateTrialSessionAlertSuccessAction,
          setAlertSuccessAction,
          navigateToTrialSessionAction,
        ],
      },
    ],
  },
];
