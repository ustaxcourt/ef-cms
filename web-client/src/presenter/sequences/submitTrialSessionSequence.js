import { clearAlertsAction } from '../actions/clearAlertsAction';
import { computeFormDateAction } from '../actions/computeFormDateAction';
import { computeTrialSessionFormDataAction } from '../actions/TrialSession/computeTrialSessionFormDataAction';
import { createTrialSessionAction } from '../actions/TrialSession/createTrialSessionAction';
import { getCreateTrialSessionAlertSuccessAction } from '../actions/TrialSession/getCreateTrialSessionAlertSuccessAction';
import { navigateToTrialSessionsAction } from '../actions/TrialSession/navigateToTrialSessionsAction';
import { set } from 'cerebral/factories';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { state } from 'cerebral';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { validateTrialSessionAction } from '../actions/TrialSession/validateTrialSessionAction';

export const submitTrialSessionSequence = [
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
      createTrialSessionAction,
      {
        error: [],
        success: [
          set(state.saveAlertsForNavigation, true),
          getCreateTrialSessionAlertSuccessAction,
          setAlertSuccessAction,
          navigateToTrialSessionsAction,
        ],
      },
      unsetWaitingForResponseAction,
    ],
  },
];
