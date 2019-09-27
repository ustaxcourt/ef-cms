import { checkForOrdersNeededAction } from '../actions/CaseDetail/checkForOrdersNeededAction';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { getCaseAction } from '../actions/getCaseAction';
import { navigateToDocumentQCAction } from '../actions/navigateToDocumentQCAction';
import { navigateToOrdersNeededAction } from '../actions/navigateToOrdersNeededAction';
import { sendPetitionToIRSHoldingQueueAction } from '../actions/sendPetitionToIRSHoldingQueueAction';
import { set } from 'cerebral/factories';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { state } from 'cerebral';

export const submitPetitionToIRSHoldingQueueSequence = [
  clearAlertsAction,
  clearModalAction,
  setCurrentPageAction('Interstitial'),
  sendPetitionToIRSHoldingQueueAction,
  setAlertSuccessAction,
  getCaseAction,
  setCaseAction,
  set(state.saveAlertsForNavigation, true),
  checkForOrdersNeededAction,
  {
    no: [navigateToDocumentQCAction],
    yes: [navigateToOrdersNeededAction],
  },
];
