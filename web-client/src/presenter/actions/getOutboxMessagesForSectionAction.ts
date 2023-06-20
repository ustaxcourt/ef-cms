import { state } from '@web-client/presenter/app.cerebral';
/**
 * fetches the outbox messages for the section
 * @param {object} applicationContext object that contains all the context specific methods
 * @param {object} providers.get the cerebral get function
 * @returns {Promise<{Message: Array}>} a list of messages
 */
export const getOutboxMessagesForSectionAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const selectedSection = get(state.messageBoxToDisplay.section);

  const messages = await applicationContext
    .getUseCases()
    .getOutboxMessagesForSectionInteractor(applicationContext, {
      section: selectedSection || applicationContext.getCurrentUser().section,
    });

  return { messages };
};
