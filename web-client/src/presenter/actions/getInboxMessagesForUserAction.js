/**
 * fetches the inbox messages for the user
 *
 * @param {object} applicationContext object that contains all the context specific methods
 * @returns {Promise<{Message: Array}>} a list of messages
 */
export const getInboxMessagesForUserAction = async ({ applicationContext }) => {
  const messages = await applicationContext
    .getUseCases()
    .getInboxMessagesForUserInteractor(applicationContext, {
      userId: applicationContext.getCurrentUser().userId,
    });

  return { messages };
};
