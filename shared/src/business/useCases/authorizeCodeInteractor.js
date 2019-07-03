const qs = require('qs');

/**
 * After a succesful login with Cognito, it redirects to our app via
 * `/login?code=XXX`. This one time use authorization code expires after
 * 5 minutes and is used for fetching the id token and refresh token
 * from Cognito.
 *
 * @param user
 * @param caseId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.authorizeCodeInteractor = async ({ applicationContext, code }) => {
  const data = qs.stringify({
    client_id: applicationContext.getCognitoClientId(),
    code,
    grant_type: 'authorization_code',
    redirect_uri: applicationContext.getCognitoRedirectUrl(),
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
    refreshToken: response.refresh_token,
    token: response.id_token,
  };
};
