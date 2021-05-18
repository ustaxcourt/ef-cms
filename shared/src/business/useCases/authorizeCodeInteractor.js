const qs = require('qs');

/**
 * After a successful login with Cognito, it redirects to our app via
 * `/login?code=ABC`. This one time use authorization code expires after
 * 5 minutes and is used for fetching the id token and refresh token
 * from Cognito.
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.code the authorization code
 * @returns {object} the refreshToken and token
 */
exports.authorizeCodeInteractor = async (applicationContext, { code }) => {
  const data = qs.stringify({
    client_id: applicationContext.getCognitoClientId(),
    code,
    grant_type: 'authorization_code',
    redirect_uri: applicationContext.getCognitoRedirectUrl(),
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
    refreshToken: postResponse.refresh_token,
    token: postResponse.id_token,
  };
};
