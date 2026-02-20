import { clearAlertsAction } from '../actions/clearAlertsAction';
import { navigateToCaseDetailCaseInformationActionFactory } from '../actions/navigateToCaseDetailCaseInformationActionFactory';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setScrollToErrorNotificationAction } from '@web-client/presenter/actions/setScrollToErrorNotificationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '@web-client/presenter/actions/setValidationErrorsAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { updateContactAction } from '../actions/updateContactAction';
import { validatePetitionerAction } from '../actions/validatePetitionerAction';

export const submitEditContactSequence = [
  clearAlertsAction,
  startShowValidationAction,
  validatePetitionerAction,
  {
    error: [
      setValidationErrorsAction,
      setScrollToErrorNotificationAction,
      setValidationAlertErrorsAction,
    ],
    success: showProgressSequenceDecorator([
      updateContactAction,
      setAlertSuccessAction,
      setSaveAlertsForNavigationAction,
      setupCurrentPageAction('Interstitial'),
      navigateToCaseDetailCaseInformationActionFactory('parties'),
    ]),
  },
];
