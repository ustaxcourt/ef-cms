import { clearAlertsAction } from '../actions/clearAlertsAction';
import { createTrialSessionAction } from '../actions/TrialSession/createTrialSessionAction';
import { getCreateTrialSessionAlertSuccessAction } from '../actions/TrialSession/getCreateTrialSessionAlertSuccessAction';
import { navigateToTrialSessionsAction } from '../actions/TrialSession/navigateToTrialSessionsAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
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
          getCreateTrialSessionAlertSuccessAction,
          setAlertSuccessAction,
          navigateToTrialSessionsAction,
        ],
      },
    ],
  },
];
