/**
 * fixme
 *
 */
export const getHealthCheckAction = async ({ applicationContext }) => {
  await applicationContext
    .getUseCases()
    .getHealthCheckInteractor({ applicationContext });
};
