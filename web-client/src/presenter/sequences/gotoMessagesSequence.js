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
import { setInboxMessageCountAction } from '../actions/setInboxMessageCountAction';
import { setMessagesAction } from '../actions/setMessagesAction';
import { setSectionInboxMessageCountAction } from '../actions/setSectionInboxMessageCountAction';

const goToMessages = [
  setCurrentPageAction('Interstitial'),
  closeMobileMenuAction,
  clearErrorAlertsAction,
  chooseMessageBoxAction,
  {
    mycompleted: [getCompletedMessagesForUserAction],
    myinbox: [
      getInboxMessagesForSectionAction,
      setSectionInboxMessageCountAction,
      getInboxMessagesForUserAction,
      setInboxMessageCountAction,
    ],
    myoutbox: [getOutboxMessagesForUserAction],
    sectioncompleted: [getCompletedMessagesForSectionAction],
    sectioninbox: [
      getInboxMessagesForUserAction,
      setInboxMessageCountAction,
      getInboxMessagesForSectionAction,
      setSectionInboxMessageCountAction,
    ],
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
