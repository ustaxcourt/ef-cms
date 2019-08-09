/**
 * fetched the document qc inbox items for a sectiom.
 *
 * @param {object} applicationContext object that contains all the context specific methods
 * @returns {Promise<{workItems: Array}>} a list of work items
 */
export const getDocumentQCInboxForSectionAction = async ({
  applicationContext,
}) => {
  const useCases = applicationContext.getUseCases();
  //gets the section from the currently logged in user
  const workItems = await useCases.getDocumentQCInboxForSectionInteractor({
    applicationContext,
  });

  return { workItems };
};
