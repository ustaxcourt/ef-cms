import { batchCompleteMessageAction } from '../actions/batchCompleteMessageAction';
import { fetchUserNotificationsSequence } from './fetchUserNotificationsSequence';
// import { getInboxMessagesForUserAction } from '../actions/getInboxMessagesForUserAction';
import { removeCompletedMessagesFromDisplayAction } from '../actions/removeCompletedMessagesFromDisplayAction';
import { resetCacheKeyAction } from '@web-client/presenter/actions/resetCacheKeyAction';
import { resetSelectedMessageAction } from '../actions/Messages/resetSelectedMessageAction';
import { setAlertErrorAction } from '@web-client/presenter/actions/setAlertErrorAction';
import { setCompleteMessageAlertAction } from '../actions/Messages/setCompleteMessageAlertAction';
import { setMessageCountsAction } from '../actions/setMessageCountsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const batchCompleteMessageSequence = showProgressSequenceDecorator([
  batchCompleteMessageAction,
  {
    error: [setAlertErrorAction],
    success: [
      setCompleteMessageAlertAction,
      removeCompletedMessagesFromDisplayAction,
      resetCacheKeyAction,
      fetchUserNotificationsSequence, //do we need to do all the stuff in here?
      setMessageCountsAction,
      resetSelectedMessageAction,
    ],
  },
]);
