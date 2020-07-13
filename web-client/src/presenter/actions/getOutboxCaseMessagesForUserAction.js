/**
 * fetches the outbox case messages for the user
 *
 * @param {object} applicationContext object that contains all the context specific methods
 * @returns {Promise<{CaseMessage: Array}>} a list of messages
 */
export const getOutboxCaseMessagesForUserAction = async ({
  applicationContext,
}) => {
  const messages = await applicationContext
    .getUseCases()
    .getOutboxCaseMessagesForUserInteractor({
      applicationContext,
      userId: applicationContext.getCurrentUser().userId,
    });

  return { messages };
};
