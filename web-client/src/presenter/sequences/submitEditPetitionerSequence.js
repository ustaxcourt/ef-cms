import { clearAlertsAction } from '../actions/clearAlertsAction';
import { navigateToCaseDetailCaseInformationActionFactory } from '../actions/navigateToCaseDetailCaseInformationActionFactory';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { updatePetitionerInformationAction } from '../actions/updatePetitionerInformationAction';
import { validatePetitionerAction } from '../actions/validatePetitionerAction';

export const submitEditPetitionerSequence = [
  clearAlertsAction,
  startShowValidationAction,
  validatePetitionerAction,
  {
    error: [setValidationAlertErrorsAction],
    success: showProgressSequenceDecorator([
      updatePetitionerInformationAction,
      setAlertSuccessAction,
      setSaveAlertsForNavigationAction,
      setCurrentPageAction('Interstitial'),
      navigateToCaseDetailCaseInformationActionFactory('petitioner'),
    ]),
  },
];
