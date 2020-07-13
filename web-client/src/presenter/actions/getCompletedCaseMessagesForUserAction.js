/**
 * fetches the completed case messages for the user
 *
 * @param {object} applicationContext object that contains all the context specific methods
 * @returns {Promise<{CaseMessage: Array}>} a list of messages
 */
export const getCompletedCaseMessagesForUserAction = async ({
  applicationContext,
}) => {
  const messages = await applicationContext
    .getUseCases()
    .getCompletedCaseMessagesForUserInteractor({
      applicationContext,
      userId: applicationContext.getCurrentUser().userId,
    });

  return { messages };
};
