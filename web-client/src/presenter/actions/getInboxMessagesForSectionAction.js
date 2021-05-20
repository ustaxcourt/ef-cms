/**
 * fetches the inbox messages for the section
 *
 * @param {object} applicationContext object that contains all the context specific methods
 * @returns {Promise<{Message: Array}>} a list of messages
 */
export const getInboxMessagesForSectionAction = async ({
  applicationContext,
}) => {
  const messages = await applicationContext
    .getUseCases()
    .getInboxMessagesForSectionInteractor(applicationContext, {
      section: applicationContext.getCurrentUser().section,
    });

  return { messages };
};
