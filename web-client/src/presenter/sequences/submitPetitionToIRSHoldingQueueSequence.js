import { checkForOrdersNeededAction } from '../actions/CaseDetail/checkForOrdersNeededAction';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { getCaseAction } from '../actions/getCaseAction';
import { gotoOrdersNeededSequence } from './gotoOrdersNeededSequence';
import { navigateToMessagesAction } from '../actions/navigateToMessagesAction';
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
    no: [navigateToMessagesAction],
    yes: [...gotoOrdersNeededSequence],
  },
];
