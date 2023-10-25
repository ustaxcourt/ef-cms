import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/clearPdfPreviewUrlAction';
import { computeSubmitTrialSessionDataAction } from '../actions/TrialSession/computeSubmitTrialSessionDataAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { setWaitingTextAction } from '../actions/setWaitingTextAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { updateTrialSessionAction } from '../actions/TrialSession/updateTrialSessionAction';
import { validateTrialSessionAction } from '../actions/TrialSession/validateTrialSessionAction';

export const updateTrialSessionSequence = [
  clearPdfPreviewUrlAction,
  clearAlertsAction,
  startShowValidationAction,
  computeSubmitTrialSessionDataAction,
  validateTrialSessionAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      setValidationAlertErrorsAction,
    ],
    success: [
      setWaitingForResponseAction,
      setWaitingTextAction(
        'Please stay on this page while we process your request.',
      ),
      updateTrialSessionAction,
      {
        error: [setAlertErrorAction],
        success: [],
      },
    ],
  },
];
