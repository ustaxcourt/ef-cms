import { state } from '@web-client/presenter/app.cerebral';

/**
 * intentionally throws an error to test RUM http telemetry.
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {Promise<*>}
 */
export const createTestApiErrorAction = ({
  applicationContext,
  get,
}: ActionProps) => {
  const url = get(state.currentPage);
  return applicationContext
    .getUseCases()
    .createTestApiErrorInteractor(applicationContext, {
      url,
    });
};
