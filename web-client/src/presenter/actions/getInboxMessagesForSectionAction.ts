import { state } from '@web-client/presenter/app.cerebral';
/**
 * fetches the inbox messages for the section
 * @param {object} applicationContext object that contains all the context specific methods
 * @param {Function} providers.get the cerebral get helper function
 * @returns {Promise<{Message: Array}>} a list of messages
 */
export const getInboxMessagesForSectionAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const selectedSection = get(state.messageBoxToDisplay.section);

  const messages = await applicationContext
    .getUseCases()
    .getInboxMessagesForSectionInteractor(applicationContext, {
      section: selectedSection || applicationContext.getCurrentUser().section,
    });

  return { messages };
};
