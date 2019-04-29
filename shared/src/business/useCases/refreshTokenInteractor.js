const qs = require('qs');

/**
 * getCase
 *
 * @param user
 * @param caseId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.refreshToken = async ({ refreshToken, applicationContext }) => {
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
