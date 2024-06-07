import { state } from '@web-client/presenter/app.cerebral';

export const batchCompleteMessageAction = async ({
  applicationContext,
  get,
}: ActionProps): Promise<void> => {
  const messages = get(state.messagesPage.selectedMessages);

  // we can do this in another action if we really want to
  const messagesToComplete = Array.from(messages, ([, parentMessageId]) => ({
    messageBody: '',
    parentMessageId,
  }));

  await applicationContext
    .getUseCases()
    .completeMessageInteractor(applicationContext, {
      messages: messagesToComplete,
    });
};
