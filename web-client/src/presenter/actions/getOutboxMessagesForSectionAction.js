/**
 * fetches the outbox messages for the section
 *
 * @param {object} applicationContext object that contains all the context specific methods
 * @returns {Promise<{Message: Array}>} a list of messages
 */
export const getOutboxMessagesForSectionAction = async ({
  applicationContext,
}) => {
  const messages = await applicationContext
    .getUseCases()
    .getOutboxMessagesForSectionInteractor(applicationContext, {
      section: applicationContext.getCurrentUser().section,
    });

  return { messages };
};
