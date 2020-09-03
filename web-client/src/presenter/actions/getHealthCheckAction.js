/**
 * fixme
 *
 */
export const getHealthCheckAction = async ({ applicationContext }) => {
  const health = await applicationContext
    .getUseCases()
    .getHealthCheckInteractor({ applicationContext });

  return { health };
};
