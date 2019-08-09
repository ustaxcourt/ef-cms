/**
 * fetches the document qc served items in a section.
 *
 * @param {object} applicationContext object that contains all the context specific methods
 * @returns {Promise<{workItems: Array}>} a list of work items
 */
export const getDocumentQCServedForSectionAction = async ({
  applicationContext,
}) => {
  //gets the section from the currently logged in user
  const workItems = await applicationContext
    .getUseCases()
    .getDocumentQCServedForSectionInteractor({
      applicationContext,
    });
  return { workItems };
};
