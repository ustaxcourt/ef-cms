import { chooseMessageBoxAction } from '../actions/chooseMessageBoxAction';
import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
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
import { setDefaultMessagePageTableSortAction } from '../actions/setDefaultMessagePageTableSortAction';
import { setIsLoadingMessagesAction } from '../actions/Messages/setIsLoadingMessagesAction';
import { setMessageCountsAction } from '../actions/setMessageCountsAction';
import { setMessagesAction } from '../actions/setMessagesAction';
import { setSectionForMessageBoxAction } from '../actions/setSectionForMessageBoxAction';
import { updateMessageTabUrlAction } from '../actions/Messages/updateMessageTabUrlAction';

export const switchMessageTabSequence = [
  setIsLoadingMessagesAction(true),
  resetCacheKeyAction,
  clearScreenMetadataAction,
  clearErrorAlertsAction,
  setDefaultMessagePageTableSortAction,
  resetSelectedMessageAction,
  setSectionForMessageBoxAction,
  updateMessageTabUrlAction,
  parallel([
    [...fetchUserNotificationsSequence, setMessageCountsAction],
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
  setIsLoadingMessagesAction(false),
];
