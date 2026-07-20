import { state } from '@web-client/presenter/app.cerebral';

/**
 * completes the selected messages from the docket clerk report, attributing the
 * completion to the report's selected clerk rather than the logged-in user
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 */
export const batchCompleteDocketClerkReportMessagesAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const messages = get(state.messagesPage.selectedMessages);
  const selectedClerk = get(state.docketClerkReport.selectedClerk);

  const messagesToComplete = Array.from(messages, ([, parentMessageId]) => ({
    messageBody: '',
    parentMessageId,
  }));

  await applicationContext
    .getUseCases()
    .completeMessageInteractor(applicationContext, {
      completedByUserId: selectedClerk?.userId,
      messages: messagesToComplete,
    });
};
