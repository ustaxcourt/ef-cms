/**
 * fetches the document qc batched work items for a user.
 *
 * @param {object} applicationContext object that contains all the context specific methods
 * @returns {Promise<{workItems: Array}>} a list of work items
 */
export const getDocumentQCBatchedForUserAction = async ({
  applicationContext,
}) => {
  const useCases = applicationContext.getUseCases();
  const workItems = await useCases.getDocumentQCBatchedForUser({
    applicationContext,
    userId: applicationContext.getCurrentUser().userId,
  });

  return { workItems };
};
