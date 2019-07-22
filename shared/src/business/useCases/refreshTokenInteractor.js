const qs = require('qs');

/**
 * Refresh the Cognito token
 *
 * @param user
 * @param caseId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.refreshTokenInteractor = async ({
  applicationContext,
  refreshToken,
}) => {
  const data = qs.stringify({
    client_id: applicationContext.getCognitoClientId(),
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });

  const response = await applicationContext
    .getHttpClient()
    .post(`${applicationContext.getCognitoTokenUrl()}`, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    })
    .then(response => response.data);

  return {
    token: response.id_token,
  };
};
