import { clearAlertsAction } from '../actions/clearAlertsAction';
import { navigateToDashboardAction } from '../actions/navigateToDashboardAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { updateUserContactInformationAction } from '../actions/updateUserContactInformationAction';
import { validateUserContactAction } from '../actions/validateUserContactAction';

export const submitUpdateUserContactInformationSequence = [
  clearAlertsAction,
  startShowValidationAction,
  validateUserContactAction,
  {
    error: [setValidationErrorsAction, setValidationAlertErrorsAction],
    success: showProgressSequenceDecorator([
      updateUserContactInformationAction,
      {
        noChange: [navigateToDashboardAction],
        success: [
          setAlertSuccessAction,
          setSaveAlertsForNavigationAction,
          setCurrentPageAction('Interstitial'),
          navigateToDashboardAction,
        ],
      },
    ]),
  },
];
