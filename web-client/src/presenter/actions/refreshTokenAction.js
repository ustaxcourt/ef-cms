import { state } from 'cerebral';

/**
 * Gets a new JWT token using the refreshToken that is in the store.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext contains the assignWorkItems method we will need from the getUseCases method
 * @param {Object} providers.store the cerebral store containing the selectedWorkItems, workQueue, assigneeId, assigneeName this method uses
 * @param {Function} providers.get the cerebral get helper function
 * @returns {undefined} currently doesn't return anything
 */
export const refreshTokenAction = async ({ applicationContext, get }) => {
  const refreshToken = get(state.refreshToken);

  const response = await applicationContext.getUseCases().refreshToken({
    applicationContext,
    refreshToken,
  });

  return {
    token: response.token,
  };
};
