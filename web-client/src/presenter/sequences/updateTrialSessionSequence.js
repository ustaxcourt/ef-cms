import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/clearPdfPreviewUrlAction';
import { computeTrialSessionFormDataAction } from '../actions/TrialSession/computeTrialSessionFormDataAction';
import { getComputedFormDateFactoryAction } from '../actions/getComputedFormDateFactoryAction';
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
  getComputedFormDateFactoryAction('startDate', null, 'computedStartDate'),
  getComputedFormDateFactoryAction(
    'estimatedEndDate',
    null,
    'computedEstimatedEndDate',
  ),
  computeTrialSessionFormDataAction,
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
