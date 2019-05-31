/**
 * fetches the work items that are associated with the user's section
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the getWorkItemsBySection use case
 * @returns {object} the list of section work items
 */
export const getWorkItemsForSectionAction = async ({ applicationContext }) => {
  const user = applicationContext.getCurrentUser();
  let sectionWorkItems = await applicationContext
    .getUseCases()
    .getWorkItemsBySection({
      applicationContext,
      section: user.section,
      userId: user.userId,
    });
  return { workItems: sectionWorkItems };
};
