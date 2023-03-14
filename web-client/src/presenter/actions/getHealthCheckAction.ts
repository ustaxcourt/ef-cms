/**
 * Retrieves the status of critical services to the application's functionality
 *
 * @param {object} providers.applicationContext the application context
 * @returns {object} object containing status of services
 */
export const getHealthCheckAction = async ({ applicationContext }) => {
  const health = await applicationContext
    .getUseCases()
    .getHealthCheckInteractor(applicationContext);

  return { health };
};
