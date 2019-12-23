import { clearAlertsAction } from '../actions/clearAlertsAction';
import { computeFormDateAction } from '../actions/computeFormDateAction';
import { computeTrialSessionFormDataAction } from '../actions/TrialSession/computeTrialSessionFormDataAction';
import { navigateToTrialSessionDetailAction } from '../actions/TrialSession/navigateToTrialSessionDetailAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { updateTrialSessionAction } from '../actions/TrialSession/updateTrialSessionAction';
import { validateTrialSessionAction } from '../actions/TrialSession/validateTrialSessionAction';

export const updateTrialSessionSequence = [
  clearAlertsAction,
  startShowValidationAction,
  computeFormDateAction,
  computeTrialSessionFormDataAction,
  validateTrialSessionAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      setValidationAlertErrorsAction,
    ],
    success: [
      stopShowValidationAction,
      setWaitingForResponseAction,
      updateTrialSessionAction,
      {
        error: [],
        success: [
          setSaveAlertsForNavigationAction,
          setAlertSuccessAction,
          navigateToTrialSessionDetailAction,
        ],
      },
      unsetWaitingForResponseAction,
    ],
  },
];
