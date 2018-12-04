const axios = require('axios');

/**
 * getCasesProxy
 * @param applicationContext
 * @param userToken
 * @returns {Promise<*>}
 */
module.exports = async ({ applicationContext, userToken }) => {
  return await axios
    .get(`${applicationContext.getBaseUrl()}/cases`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
    .then(response => {
      if (!(response.data && Array.isArray(response.data))) {
        return response.data;
      } else {
        // TODO: remove this once backend can sort
        response.data.sort(function(a, b) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
      }
      return response.data;
    });
};
