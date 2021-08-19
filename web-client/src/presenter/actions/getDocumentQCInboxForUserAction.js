/**
 * fetches the document qc inbox work items for a user,
 *
 * @param {object} applicationContext object that contains all the context specific methods
 * @returns {Promise<{workItems: Array}>} a list of work items
 */
export const getDocumentQCInboxForUserAction = async ({
  applicationContext,
}) => {
  const workItems = await applicationContext
    .getUseCases()
    .getDocumentQCInboxForUserInteractor(applicationContext, {
      userId: applicationContext.getCurrentUser().userId,
    });

  return { workItems };
};
