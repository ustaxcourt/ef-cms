/**
 * fetches the inbox messages for a user.
 *
 * @param {object} applicationContext object that contains all the context specific methods
 * @returns {Promise<{workItems: Array}>} a list of work items
 */
export const getInboxMessagesForUserAction = async ({ applicationContext }) => {
  const useCases = applicationContext.getUseCases();
  const workItems = await useCases.getInboxMessagesForUserInteractor({
    applicationContext,
    userId: applicationContext.getCurrentUser().userId,
  });

  return { workItems };
};
