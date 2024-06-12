import { createISODateString } from '../../../../shared/src/business/utilities/DateHandler';
import { state } from '@web-client/presenter/app.cerebral';

export const batchCompleteMessageAction = async ({
  applicationContext,
  get,
  store,
}: ActionProps): Promise<void> => {
  const messages = get(state.messagesPage.selectedMessages);

  const messagesToComplete = Array.from(messages, ([, parentMessageId]) => ({
    messageBody: '',
    parentMessageId,
  }));

  // what if some of these fail?
  const { user } = await applicationContext
    .getUseCases()
    .completeMessageInteractor(applicationContext, {
      messages: messagesToComplete,
    });

  store.set(state.messagesPage.messagesCompletedBy, user);
  store.set(state.messagesPage.messagesCompletedAt, createISODateString());
  store.set(
    state.messagesPage.completedMessagesList,
    Array.from(messages.keys()),
  );
};
