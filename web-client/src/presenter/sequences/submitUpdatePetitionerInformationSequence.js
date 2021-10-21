import { navigateToCaseDetailCaseInformationActionFactory } from '../actions/navigateToCaseDetailCaseInformationActionFactory';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { updatePetitionerInformationAction } from '../actions/updatePetitionerInformationAction';

export const submitUpdatePetitionerInformationSequence = [
  updatePetitionerInformationAction,
  setSaveAlertsForNavigationAction,
  setAlertSuccessAction,
  setCurrentPageAction('Interstitial'),
  navigateToCaseDetailCaseInformationActionFactory('parties'),
];
