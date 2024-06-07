import { batchCompleteMessageAction } from '../actions/batchCompleteMessageAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

// kinda combines goToMessageDetailSequence and completeMessageSequence
export const batchCompleteMessageSequence = showProgressSequenceDecorator([
  /**
   * I used completeMessageSequence as reference for my work here.
   *
   * The purpose of getMostRecentMessageInThreadAction is unclear to me,
   * but from what I can gather:
   *
   * When you click a message in the inbox, it takes you to the most recent
   * message in it but you can also see all the messages in the thread.
   * You're able to complete the thread from any of the messages, but the
   * LATEST message is the one that is marked for completion in the
   * interactor.
   *
   * getMostRecentMessageInThreadAction gets the last message via
   * messageDetail that's saved in state.
   *
   * The interactor later gets the latest message again, but instead by
   * getting it via the last message of the thread from persistence.
   *
   * The interactor really only needs a parentMessageId to complete a
   * message because it can use that to find the most recent message in
   * the thread. The most recent message of any thread is displayed in
   * the inbox, and it has parentMessageId.
   * So I think we should change setSelectedMessageAction to set
   * { messageId, parentMessageId } in state and pass parentMessageId to
   * the interactor.
   *
   * I got pretty far with this but now setSelectedMessageAction doesn't work.
   *
   * Feel free to change this if you think it's dumb. Also, working with the
   * map() was interesting. Was wondering why we did that instead of an object.
   * Might make sense to change back to an object now.
   */

  batchCompleteMessageAction,

  // display success / failure banner
  // refresh inbox
]);
