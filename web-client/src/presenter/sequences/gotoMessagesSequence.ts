import { chooseMessageBoxAction } from '../actions/chooseMessageBoxAction';
import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { fetchUserNotificationsSequence } from './fetchUserNotificationsSequence';
import { getCompletedMessagesForSectionAction } from '../actions/getCompletedMessagesForSectionAction';
import { getCompletedMessagesForUserAction } from '../actions/getCompletedMessagesForUserAction';
import { getInboxMessagesForSectionAction } from '../actions/getInboxMessagesForSectionAction';
import { getInboxMessagesForUserAction } from '../actions/getInboxMessagesForUserAction';
import { getOutboxMessagesForSectionAction } from '../actions/getOutboxMessagesForSectionAction';
import { getOutboxMessagesForUserAction } from '../actions/getOutboxMessagesForUserAction';
import { parallel } from 'cerebral';
import { resetCacheKeyAction } from '../actions/resetCacheKeyAction';
import { resetSelectedMessageAction } from '@web-client/presenter/actions/Messages/resetSelectedMessageAction';
import { setDefaultTableSortAction } from '../actions/setDefaultTableSortAction';
import { setMessageCountsAction } from '../actions/setMessageCountsAction';
import { setMessagesAction } from '../actions/setMessagesAction';
import { setSectionForMessageBoxAction } from '../actions/setSectionForMessageBoxAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoMessagesSequence = startWebSocketConnectionSequenceDecorator([
  setupCurrentPageAction('Interstitial'),
  resetCacheKeyAction,
  closeMobileMenuAction,
  clearScreenMetadataAction,
  clearErrorAlertsAction,
  setDefaultTableSortAction,
  setSectionForMessageBoxAction,
  resetSelectedMessageAction,
  parallel([
    [fetchUserNotificationsSequence, setMessageCountsAction],
    [
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
    ],
  ]),
  setupCurrentPageAction('Messages'),
]);
