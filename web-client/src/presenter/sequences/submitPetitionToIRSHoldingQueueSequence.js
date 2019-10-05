import { checkForOrdersNeededAction } from '../actions/CaseDetail/checkForOrdersNeededAction';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { getCaseAction } from '../actions/getCaseAction';
import { navigateToDocumentQCAction } from '../actions/navigateToDocumentQCAction';
import { navigateToOrdersNeededAction } from '../actions/navigateToOrdersNeededAction';
import { sendPetitionToIRSHoldingQueueAction } from '../actions/sendPetitionToIRSHoldingQueueAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';

export const submitPetitionToIRSHoldingQueueSequence = [
  clearAlertsAction,
  clearModalAction,
  setCurrentPageAction('Interstitial'),
  sendPetitionToIRSHoldingQueueAction,
  setAlertSuccessAction,
  getCaseAction,
  setCaseAction,
  setSaveAlertsForNavigationAction,
  checkForOrdersNeededAction,
  {
    no: [navigateToDocumentQCAction],
    yes: [navigateToOrdersNeededAction],
  },
];
