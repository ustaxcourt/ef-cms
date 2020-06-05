import { chooseMessageBoxAction } from '../actions/chooseMessageBoxAction';
import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { getInboxCaseMessagesForUserAction } from '../actions/getInboxCaseMessagesForUserAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCaseMessagesAction } from '../actions/setCaseMessagesAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

const goToCaseMessages = [
  setCurrentPageAction('Interstitial'),
  closeMobileMenuAction,
  clearErrorAlertsAction,
  chooseMessageBoxAction,
  getInboxCaseMessagesForUserAction,
  setCaseMessagesAction,
  setCurrentPageAction('CaseMessages'),
];

export const gotoCaseMessagesSequence = [
  isLoggedInAction,
  {
    isLoggedIn: goToCaseMessages,
    unauthorized: [redirectToCognitoAction],
  },
];
