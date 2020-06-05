/**
 * fetches the document qc inbox work items for a user,
 *
 * @param {object} applicationContext object that contains all the context specific methods
 * @returns {Promise<{workItems: Array}>} a list of work items
 */
export const getInboxCaseMessagesForUserAction = async ({
  applicationContext,
}) => {
  const messages = await applicationContext
    .getUseCases()
    .getInboxCaseMessagesForUserInteractor({
      applicationContext,
      userId: applicationContext.getCurrentUser().userId,
    });

  return { messages };
};
