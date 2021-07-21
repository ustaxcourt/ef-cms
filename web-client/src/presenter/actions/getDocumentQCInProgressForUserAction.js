/**
 * fetches the document qc in progress work items for a user,
 *
 * @param {object} applicationContext object that contains all the context specific methods
 * @returns {Promise<{workItems: Array}>} a list of work items
 */
export const getDocumentQCInProgressForUserAction = async ({
  applicationContext,
}) => {
  const workItems = await applicationContext
    .getUseCases()
    .getDocumentQCInProgressForUserInteractor(applicationContext, {
      userId: applicationContext.getCurrentUser().userId,
    });

  return { workItems };
};
