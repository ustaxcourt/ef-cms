/**
 * fetches the completed messages for the section
 *
 * @param {object} applicationContext object that contains all the context specific methods
 * @returns {Promise<{Message: Array}>} a list of messages
 */
export const getCompletedMessagesForSectionAction = async ({
  applicationContext,
}) => {
  const messages = await applicationContext
    .getUseCases()
    .getCompletedMessagesForSectionInteractor(applicationContext, {
      section: applicationContext.getCurrentUser().section,
    });

  return { messages };
};
