/**
 * fetches the document qc served items in a section.
 *
 * @param {object} applicationContext object that contains all the context specific methods
 * @returns {Promise<{workItems: Array}>} a list of work items
 */
export const getDocumentQCServedForSectionAction = async ({
  applicationContext,
}) => {
  const user = applicationContext.getCurrentUser();
  const workItems = await applicationContext
    .getUseCases()
    .getDocumentQCServedForSectionInteractor(applicationContext, {
      section: user.section,
    });
  return { workItems };
};
