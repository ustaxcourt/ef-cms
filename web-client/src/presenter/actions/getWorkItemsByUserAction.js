/**
 *
 * @param applicationContext
 * @returns {Promise<{workItems: *}>}
 */
export default async ({ applicationContext }) => {
  console.log('enter get workItems by user action');

  const useCases = applicationContext.getUseCases();
  const workItems = await useCases.getWorkItems({
    applicationContext,
  });

  console.log('get workItems by user action', workItems.length);

  return { workItems };
};
