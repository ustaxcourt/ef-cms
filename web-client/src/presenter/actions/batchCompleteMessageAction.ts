import { createISODateString } from '../../../../shared/src/business/utilities/DateHandler';
import { formatDateIfToday } from '../computeds/formattedWorkQueue';
import { createISODateString } from '../../../../shared/src/business/utilities/DateHandler';
import { state } from '@web-client/presenter/app.cerebral';

export const batchCompleteMessageAction = async ({
  applicationContext,
  get,
  store,
}: ActionProps): Promise<{ batchCompleteResult: BatchCompleteResultType }> => {
  const messages = get(state.messagesPage.selectedMessages);

  const batchCompleteResult: BatchCompleteResultType = {
    completedAtFormatted: '',
    completedBy: '',
    success: false,
  };
  const messagesToComplete = Array.from(messages, ([, parentMessageId]) => ({
    messageBody: '',
    parentMessageId,
  }));

  try {
    // what if some of these fail?
  const { user } = await applicationContext
      .getUseCases()
      .completeMessageInteractor(applicationContext, {
        messages: messagesToComplete,
      });

    const now = createISODateString();

    batchCompleteResult.success = true;
    batchCompleteResult.completedBy = applicationContext.getCurrentUser().name;
    batchCompleteResult.completedAtFormatted = formatDateIfToday(
      now,
      applicationContext,
    );
  } catch (error) {
    console.error(
      'Something happened while trying to complete messages from the inbox',
      error,
    );
  }
  store.set(state.messagesPage.messagesCompletedBy, user);
  store.set(state.messagesPage.messagesCompletedAt, createISODateString());
  store.set(
    state.messagesPage.completedMessagesList,
    Array.from(messages.keys()),
  );
  
  return { batchCompleteResult };
};

export type BatchCompleteResultType = {
  success: boolean;
  completedAtFormatted: string;
  completedBy: string;
};
