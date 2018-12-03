const axios = require('axios');

/**
 * getCaseProxy
 *
 * @param applicationContext
 * @param caseId
 * @param userToken
 * @returns {Promise<*>}
 */
exports.getCase = async ({ applicationContext, caseId, userToken }) => {
  const response = await axios.get(
    `${applicationContext.getBaseUrl()}/cases/${caseId}`,
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    },
  );
  return response.data;
};
