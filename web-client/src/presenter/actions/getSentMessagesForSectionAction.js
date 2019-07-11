/**
 * fetches the sent messages for a secton.
 *
 * @param {object} applicationContext object that contains all the context specific methods
 * @returns {object} a list of sent work items
 */
export const getSentMessagesForSectionAction = async ({
  applicationContext,
}) => {
  const user = applicationContext.getCurrentUser();
  let workItems = await applicationContext
    .getUseCases()
    .getSentMessagesForSection({
      applicationContext,
      section: user.section,
    });
  return { workItems };
};
