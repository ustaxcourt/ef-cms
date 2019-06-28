/**
 * action for fetching all the work items associated with a user account.
 *
 * @param {object} applicationContext object that contains all the context specific methods
 * @returns {Promise<{workItems: Array}>} a list of work items
 */
export const getDocumentQCInboxForUserAction = async ({
  applicationContext,
}) => {
  const useCases = applicationContext.getUseCases();
  const workItems = await useCases.getDocumentQCInboxForUser({
    applicationContext,
    userId: applicationContext.getCurrentUser().userId,
  });

  return { workItems };
};
