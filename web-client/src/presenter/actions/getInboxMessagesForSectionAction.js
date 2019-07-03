/**
 * fetches the inbox messages for a section.
 *
 * @param {object} applicationContext object that contains all the context specific methods
 * @returns {Promise<{workItems: Array}>} a list of work items
 */
export const getInboxMessagesForSectionAction = async ({
  applicationContext,
}) => {
  const user = applicationContext.getCurrentUser();

  const useCases = applicationContext.getUseCases();
  const workItems = await useCases.getInboxMessagesForSection({
    applicationContext,
    section: user.section,
  });

  return { workItems };
};
