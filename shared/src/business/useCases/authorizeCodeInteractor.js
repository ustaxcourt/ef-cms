const qs = require('qs');

/**
 * authorizeCode
 *
 * @param user
 * @param caseId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.authorizeCode = async ({ code, applicationContext }) => {
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
