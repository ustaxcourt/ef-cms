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
  () => console.log('t'),
  startShowValidationAction,
  () => console.log('u'),
  validateUserContactAction,
  {
    error: [setValidationErrorsAction, setValidationAlertErrorsAction],
    success: showProgressSequenceDecorator([
      () => console.log('v'),
      updateUserContactInformationAction,
      {
        noChange: [navigateToDashboardAction],
        success: [
          () => console.log('w'),
          setAlertSuccessAction,
          setSaveAlertsForNavigationAction,
          setCurrentPageAction('Interstitial'),
          navigateToDashboardAction,
        ],
      },
    ]),
  },
];
