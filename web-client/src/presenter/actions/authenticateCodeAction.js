/**
 * Gets the JWT token and refresh token using the cognito authorization code.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext contains the assignWorkItems method we will need from the getUseCases method
 * @param {object} providers.store the cerebral store containing the selectedWorkItems, workQueue, assigneeId, assigneeName this method uses
 * @param {Function} providers.get the cerebral get helper function
 * @returns {undefined} currently doesn't return anything
 */
export const authenticateCodeAction = async ({ applicationContext, props }) => {
  const code = props.code;

  const response = await applicationContext.getUseCases().authorizeCode({
    applicationContext,
    code,
  });

  return {
    refreshToken: response.refreshToken,
    token: response.token,
  };
};
