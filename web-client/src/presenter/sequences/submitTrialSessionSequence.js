import { clearAlertsAction } from '../actions/clearAlertsAction';
import { computeTrialSessionFormDataAction } from '../actions/TrialSession/computeTrialSessionFormDataAction';
import { createTrialSessionAction } from '../actions/TrialSession/createTrialSessionAction';
import { getComputedFormDateFactoryAction } from '../actions/getComputedFormDateFactoryAction';
import { getCreateTrialSessionAlertSuccessAction } from '../actions/TrialSession/getCreateTrialSessionAlertSuccessAction';
import { navigateToTrialSessionsAction } from '../actions/TrialSession/navigateToTrialSessionsAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateTrialSessionAction } from '../actions/TrialSession/validateTrialSessionAction';

export const submitTrialSessionSequence = [
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
    success: showProgressSequenceDecorator([
      stopShowValidationAction,
      createTrialSessionAction,
      {
        error: [setAlertErrorAction],
        success: [
          setSaveAlertsForNavigationAction,
          getCreateTrialSessionAlertSuccessAction,
          setAlertSuccessAction,
          navigateToTrialSessionsAction,
        ],
      },
    ]),
  },
];
