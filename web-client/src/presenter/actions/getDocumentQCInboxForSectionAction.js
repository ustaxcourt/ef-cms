/**
 * fetched the document qc inbox items for a sectiom.
 *
 * @param {object} applicationContext object that contains all the context specific methods
 * @returns {Promise<{workItems: Array}>} a list of work items
 */
export const getDocumentQCInboxForSectionAction = async ({
  applicationContext,
}) => {
  const user = applicationContext.getCurrentUser();

  const useCases = applicationContext.getUseCases();
  const workItems = await useCases.getDocumentQCInboxForSectionInteractor({
    applicationContext,
    section: user.section,
  });

  return { workItems };
};
