import { addPetitionerToCaseAction } from '../actions/addPetitionerToCaseAction';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { navigateToCaseDetailCaseInformationActionFactory } from '../actions/navigateToCaseDetailCaseInformationActionFactory';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseDetailPageTabFrozenAction } from '../actions/CaseDetail/setCaseDetailPageTabFrozenAction';
import { setPartyViewTabAfterUpdatingPetitionersAction } from '../actions/setPartyViewTabAfterUpdatingPetitionersAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
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
      setPartyViewTabAfterUpdatingPetitionersAction,
      setCaseDetailPageTabFrozenAction,
      setSaveAlertsForNavigationAction,
      setAlertSuccessAction,
      setupCurrentPageAction('Interstitial'),
      navigateToCaseDetailCaseInformationActionFactory('parties'),
    ]),
  },
];
