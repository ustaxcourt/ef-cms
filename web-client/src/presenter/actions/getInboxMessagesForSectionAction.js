/**
 * fetches the inbox messages for a section.
 *
 * @param {object} applicationContext object that contains all the context specific methods
 * @returns {Promise<{workItems: Array}>} a list of work items
 */
export const getInboxMessagesForSectionAction = async ({
  applicationContext,
}) => {
  const useCases = applicationContext.getUseCases();
  //gets the section from the currently logged in user
  const workItems = await useCases.getInboxMessagesForSectionInteractor({
    applicationContext,
  });

  return { workItems };
};
