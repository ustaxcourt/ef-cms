import { batchCompleteMessageAction } from '../actions/batchCompleteMessageAction';
// import { batchGetMostRecentMessageInThreadAction } from './batchGetMostRecentMessageInThreadAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

// combining goToMessageDetailSequence and completeMessageSequence
export const batchCompleteMessageSequence = showProgressSequenceDecorator([
  // only the most recent message in a thread is displayed in the inbox,
  // so we might not need this next action. I can't really figure out what
  // the purpose of getting the latest message in the thread is (referencing
  // completeMessageSequence). looks like we do it once in the action based
  // on what's loaded in the inbox, and once more by reloading the data from
  // persistence in the interactor.
  // batchGetMostRecentMessageInThreadAction,

  // honestly it'd be easiest if we stored { messageId, parentMessageId }
  // when selecting check boxes. I started working on this but it got messy
  // so I went home instead.
  // the change broke setSelectedMessagesAction.

  // complete all the messages at once. realistically the only thing
  // this action needs is a list of parentMessageIds
  batchCompleteMessageAction,

  // display success / failure banner
  // refresh inbox
]);
