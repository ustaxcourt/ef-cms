/**
 * Gets the JWT token and refresh token using the cognito authorization code.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext contains the assignWorkItems method we will need from the getUseCases method
 * @param {object} providers.store the cerebral store containing the selectedWorkItems, workQueue, assigneeId, assigneeName this method uses
 * @param {Function} providers.get the cerebral get helper function
 * @returns {Promise} async action
 */
export const authenticateCodeAction = async ({ applicationContext, props }) => {
  const { code } = props;

  const response = await applicationContext
    .getUseCases()
    .authorizeCodeInteractor({
      applicationContext,
      code,
    });

  return {
    refreshToken: response.refreshToken,
    token: response.token,
  };
};
