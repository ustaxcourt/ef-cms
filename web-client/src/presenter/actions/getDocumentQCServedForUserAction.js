/**
 * fetches the document qc served work items for a user.
 *
 * @param {object} applicationContext object that contains all the context specific methods
 * @returns {Promise<{workItems: Array}>} a list of work items
 */
export const getDocumentQCServedForUserAction = async ({
  applicationContext,
}) => {
  const workItems = await applicationContext
    .getUseCases()
    .getDocumentQCServedForUserInteractor(applicationContext, {
      userId: applicationContext.getCurrentUser().userId,
    });

  return { workItems };
};
