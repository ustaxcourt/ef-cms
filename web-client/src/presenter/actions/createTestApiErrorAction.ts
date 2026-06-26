/**
 * intentionally hits a nonexistent API endpoint to test RUM http telemetry.
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {Promise<*>}
 */
export const createTestApiErrorAction = ({
  applicationContext,
}: ActionProps) => {
  const url = `${applicationContext.getBaseUrl()}/api/does-not-exist`;
  return applicationContext
    .getUseCases()
    .createTestApiErrorInteractor(applicationContext, {
      url,
    });
};
