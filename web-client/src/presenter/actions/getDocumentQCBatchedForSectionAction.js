/**
 * fetches the document qc batched work items in a sectiom.
 *
 * @param {object} applicationContext object that contains all the context specific methods
 * @returns {Promise<{workItems: Array}>} a list of work items
 */
export const getDocumentQCBatchedForSectionAction = async ({
  applicationContext,
}) => {
  //gets the section from the currently logged in user
  const workItems = await applicationContext
    .getUseCases()
    .getDocumentQCBatchedForSectionInteractor({
      applicationContext,
    });
  return { workItems };
};
