/**
 * fetches the completed messages for the user
 *
 * @param {object} applicationContext object that contains all the context specific methods
 * @returns {Promise<{Message: Array}>} a list of messages
 */
export const getCompletedMessagesForUserAction = async ({
  applicationContext,
}) => {
  const messages = await applicationContext
    .getUseCases()
    .getCompletedMessagesForUserInteractor(applicationContext, {
      userId: applicationContext.getCurrentUser().userId,
    });

  return { messages };
};
