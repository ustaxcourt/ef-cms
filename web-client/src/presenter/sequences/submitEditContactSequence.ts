import { clearAlertsAction } from '../actions/clearAlertsAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseDetailPageTabFrozenAction } from '../actions/CaseDetail/setCaseDetailPageTabFrozenAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
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
    error: [setValidationAlertErrorsAction],
    success: showProgressSequenceDecorator([
      updateContactAction,
      setAlertSuccessAction,
      setSaveAlertsForNavigationAction,
      setCaseDetailPageTabFrozenAction,
      setupCurrentPageAction('Interstitial'),
      navigateToCaseDetailAction,
    ]),
  },
];
