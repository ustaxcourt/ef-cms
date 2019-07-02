/**
 * fetches the document qc batched work items in a sectiom.
 *
 * @param {object} applicationContext object that contains all the context specific methods
 * @returns {Promise<{workItems: Array}>} a list of work items
 */
export const getDocumentQCBatchedForSectionAction = async ({
  applicationContext,
}) => {
  const user = applicationContext.getCurrentUser();
  const workItems = await applicationContext
    .getUseCases()
    .getDocumentQCBatchedForSection({
      applicationContext,
      section: user.section,
    });
  return { workItems };
};
