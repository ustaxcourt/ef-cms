import { navigateToCaseDetailCaseInformationActionFactory } from '../actions/navigateToCaseDetailCaseInformationActionFactory';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { updatePetitionerInformationAction } from '../actions/updatePetitionerInformationAction';

export const submitUpdatePetitionerInformationSequence = [
  updatePetitionerInformationAction,
  setSaveAlertsForNavigationAction,
  setAlertSuccessAction,
  setupCurrentPageAction('Interstitial'),
  navigateToCaseDetailCaseInformationActionFactory('parties'),
];
