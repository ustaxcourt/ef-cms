import { createISODateString } from '@shared/business/utilities/DateHandler';
import { formatDateIfToday } from '../computeds/formattedWorkQueue';
import { state } from '@web-client/presenter/app.cerebral';

export const batchCompleteMessageAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
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

  let completedMessages;

  try {
    // what if some of these fail?
    completedMessages = await applicationContext
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
    return path.error({
      alertError: {
        message: 'Please try again',
        title: 'Messages could not be completed',
      },
    });
  }

  return path.success({ completedMessages });
};

export type BatchCompleteResultType = {
  success: boolean;
  completedAtFormatted: string;
  completedBy: string;
};
