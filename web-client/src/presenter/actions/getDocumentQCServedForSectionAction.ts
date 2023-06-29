import { state } from '@web-client/presenter/app.cerebral';

/**
 * fetches the document qc served items in a section.
 * @param {object} applicationContext object that contains all the context specific methods
 * @param {Function} providers.get the cerebral get helper function
 * @returns {Promise<{workItems: Array}>} a list of work items
 */
export const getDocumentQCServedForSectionAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const selectedSection = get(state.workQueueToDisplay.section);

  const user = applicationContext.getCurrentUser();
  const workItems = await applicationContext
    .getUseCases()
    .getDocumentQCServedForSectionInteractor(applicationContext, {
      section: selectedSection || user.section,
    });
  return { workItems };
};
