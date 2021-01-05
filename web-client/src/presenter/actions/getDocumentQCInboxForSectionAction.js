import { state } from 'cerebral';

/**
 * fetched the document qc inbox items for a section.
 *
 * @param {object} applicationContext object that contains all the context specific methods
 * @returns {Promise<{workItems: Array}>} a list of work items
 */
export const getDocumentQCInboxForSectionAction = async ({
  applicationContext,
  get,
}) => {
  const user = applicationContext.getCurrentUser();
  const judgeUser = get(state.judgeUser);

  const workItems = await applicationContext
    .getUseCases()
    .getDocumentQCInboxForSectionInteractor({
      applicationContext,
      judgeUser,
      section: user.section,
    });

  return { workItems };
};
