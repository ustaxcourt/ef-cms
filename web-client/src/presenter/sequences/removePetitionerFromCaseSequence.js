import { clearModalAction } from '../actions/clearModalAction';
import { navigateToCaseDetailCaseInformationActionFactory } from '../actions/navigateToCaseDetailCaseInformationActionFactory';
import { removePetitionerFromCaseAction } from '../actions/caseAssociation/removePetitionerFromCaseAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';

export const removePetitionerFromCaseSequence = [
  clearModalAction,
  removePetitionerFromCaseAction,
  setSaveAlertsForNavigationAction,
  setAlertSuccessAction,
  setCurrentPageAction('Interstitial'),
  navigateToCaseDetailCaseInformationActionFactory('petitioner'),
];
