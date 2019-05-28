/**
 * get the sent work items in a section.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext the application context used for getting the getSentWorkItemsForSection use case
 * @returns {Object} a list of sent work items
 */
export const getSentWorkItemsForSectionAction = async ({
  applicationContext,
}) => {
  const user = applicationContext.getCurrentUser();
  let workItems = await applicationContext
    .getUseCases()
    .getSentWorkItemsForSection({
      applicationContext,
      section: user.section,
    });
  return { workItems };
};
