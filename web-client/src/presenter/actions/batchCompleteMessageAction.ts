import { state } from '@web-client/presenter/app.cerebral';

export const batchCompleteMessageAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const messages = get(state.messagesPage.selectedMessages);

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
