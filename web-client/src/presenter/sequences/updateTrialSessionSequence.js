import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/clearPdfPreviewUrlAction';
import { computeTrialSessionFormDataAction } from '../actions/TrialSession/computeTrialSessionFormDataAction';
import { getComputedFormDateFactoryAction } from '../actions/getComputedFormDateFactoryAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { updateTrialSessionAction } from '../actions/TrialSession/updateTrialSessionAction';
import { validateTrialSessionAction } from '../actions/TrialSession/validateTrialSessionAction';

export const updateTrialSessionSequence = [
  clearPdfPreviewUrlAction,
  setWaitingForResponseAction,
  clearAlertsAction,
  startShowValidationAction,
  getComputedFormDateFactoryAction(null),
  computeTrialSessionFormDataAction,
  validateTrialSessionAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      setValidationAlertErrorsAction,
    ],
    success: [
      updateTrialSessionAction,
      {
        error: [setAlertErrorAction],
        success: [],
      },
    ],
  },
];
