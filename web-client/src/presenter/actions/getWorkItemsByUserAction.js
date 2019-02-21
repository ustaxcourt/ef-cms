/**
 * action for fetching all the work items associated with a user account.
 *
 * @param {Object} applicationContext object that contains all the context specific methods
 * @returns {Promise<{workItems: Array}>} a list of work items
 */
export default async ({ applicationContext }) => {
  const useCases = applicationContext.getUseCases();
  const workItems = await useCases.getWorkItems({
    applicationContext,
  });

  return { workItems };
};
