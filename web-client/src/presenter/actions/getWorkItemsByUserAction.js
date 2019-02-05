/**
 *
 * @param applicationContext
 * @returns {Promise<{workItems: *}>}
 */
export default async ({ applicationContext }) => {
  const useCases = applicationContext.getUseCases();
  const workItems = await useCases.getWorkItems({
    applicationContext,
  });

  return { workItems };
};
