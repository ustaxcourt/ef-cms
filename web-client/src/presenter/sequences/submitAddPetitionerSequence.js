import { addPetitionerToCaseAction } from '../actions/addPetitionerToCaseAction';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { navigateToCaseDetailCaseInformationActionFactory } from '../actions/navigateToCaseDetailCaseInformationActionFactory';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setPartyViewTabAfterRemoveAction } from '../actions/setPartyViewTabAfterRemoveAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { validateAddPetitionerAction } from '../actions/validateAddPetitionerAction';

export const submitAddPetitionerSequence = [
  clearAlertsAction,
  startShowValidationAction,
  validateAddPetitionerAction,
  {
    error: [setValidationAlertErrorsAction, setValidationErrorsAction],
    success: showProgressSequenceDecorator([
      addPetitionerToCaseAction,
      setPartyViewTabAfterRemoveAction,
      setSaveAlertsForNavigationAction,
      setAlertSuccessAction,
      setCurrentPageAction('Interstitial'),
      navigateToCaseDetailCaseInformationActionFactory('parties'),
    ]),
  },
];
