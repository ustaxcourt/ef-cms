import { batchCompleteMessageAction } from '../actions/batchCompleteMessageAction';
// import { getInboxMessagesForUserAction } from '../actions/getInboxMessagesForUserAction';
import { removeCompletedMessagesFromDisplayAction } from '../actions/removeCompletedMessagesFromDisplayAction';
import { setMessagesAction } from '../actions/setMessagesAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const batchCompleteMessageSequence = showProgressSequenceDecorator([
  batchCompleteMessageAction,
  removeCompletedMessagesFromDisplayAction,
  // can we just re-get the inbox messages, or somehow run the
  // remaining messages through the formatter?
  // getInboxMessagesForUserAction,
  setMessagesAction,
]);
