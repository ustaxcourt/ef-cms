const qs = require('qs');

/**
 * Refresh the Cognito token
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.refreshToken the refresh token
 * @returns {object} the token
 */
exports.refreshTokenInteractor = async (
  applicationContext,
  { refreshToken },
) => {
  const data = qs.stringify({
    client_id: applicationContext.getCognitoClientId(),
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });

  const postResponse = await applicationContext
    .getHttpClient()
    .post(applicationContext.getCognitoTokenUrl(), data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    })
    .then(response => response.data);

  return {
    token: postResponse.id_token,
  };
};
