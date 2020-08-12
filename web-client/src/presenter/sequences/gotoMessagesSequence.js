import { chooseMessageBoxAction } from '../actions/chooseMessageBoxAction';
import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { getCompletedMessagesForSectionAction } from '../actions/getCompletedMessagesForSectionAction';
import { getCompletedMessagesForUserAction } from '../actions/getCompletedMessagesForUserAction';
import { getInboxMessagesForSectionAction } from '../actions/getInboxMessagesForSectionAction';
import { getInboxMessagesForUserAction } from '../actions/getInboxMessagesForUserAction';
import { getOutboxMessagesForSectionAction } from '../actions/getOutboxMessagesForSectionAction';
import { getOutboxMessagesForUserAction } from '../actions/getOutboxMessagesForUserAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setMessagesAction } from '../actions/setMessagesAction';

const goToMessages = [
  setCurrentPageAction('Interstitial'),
  closeMobileMenuAction,
  clearErrorAlertsAction,
  chooseMessageBoxAction,
  {
    mycompleted: [getCompletedMessagesForUserAction],
    myinbox: [getInboxMessagesForUserAction],
    myoutbox: [getOutboxMessagesForUserAction],
    sectioncompleted: [getCompletedMessagesForSectionAction],
    sectioninbox: [getInboxMessagesForSectionAction],
    sectionoutbox: [getOutboxMessagesForSectionAction],
  },
  setMessagesAction,
  setCurrentPageAction('Messages'),
];

export const gotoMessagesSequence = [
  isLoggedInAction,
  {
    isLoggedIn: goToMessages,
    unauthorized: [redirectToCognitoAction],
  },
];
