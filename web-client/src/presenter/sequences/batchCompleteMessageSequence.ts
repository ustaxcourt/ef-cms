import { batchCompleteMessageAction } from '../actions/batchCompleteMessageAction';
import { fetchUserNotificationsSequence } from './fetchUserNotificationsSequence';
// import { getInboxMessagesForUserAction } from '../actions/getInboxMessagesForUserAction';
import { removeCompletedMessagesFromDisplayAction } from '../actions/removeCompletedMessagesFromDisplayAction';
import { resetSelectedMessageAction } from '../actions/Messages/resetSelectedMessageAction';
import { setCompleteMessageAlertAction } from '../actions/Messages/setCompleteMessageAlertAction';
import { setMessageCountsAction } from '../actions/setMessageCountsAction';
import { setMessagesAction } from '../actions/setMessagesAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const batchCompleteMessageSequence = showProgressSequenceDecorator([
  batchCompleteMessageAction,
  setCompleteMessageAlertAction,
  removeCompletedMessagesFromDisplayAction,
  // can we just re-get the inbox messages, or somehow run the
  // remaining messages through the formatter?
  // getInboxMessagesForUserAction,
  setMessagesAction,
  fetchUserNotificationsSequence, //do we need to do all the stuff in here?
  setMessageCountsAction,
  resetSelectedMessageAction,
]);
