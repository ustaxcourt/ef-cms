import { clearAlertsAction } from '../actions/clearAlertsAction';
import { computeSubmitTrialSessionDataAction } from '../actions/TrialSession/computeSubmitTrialSessionDataAction';
import { createTrialSessionAction } from '../actions/TrialSession/createTrialSessionAction';
import { getCreateTrialSessionAlertSuccessAction } from '../actions/TrialSession/getCreateTrialSessionAlertSuccessAction';
import { navigateToNewTrialSessionsAction } from '@web-client/presenter/actions/TrialSession/navigateToNewTrialSessionsAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setScrollToErrorNotificationAction } from '@web-client/presenter/actions/setScrollToErrorNotificationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateTrialSessionAction } from '../actions/TrialSession/validateTrialSessionAction';

export const submitTrialSessionSequence = [
  clearAlertsAction,
  startShowValidationAction,
  computeSubmitTrialSessionDataAction,
  validateTrialSessionAction,
  {
    error: [
      setValidationErrorsAction,
      setScrollToErrorNotificationAction,
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
          navigateToNewTrialSessionsAction,
        ],
      },
    ]),
  },
];
