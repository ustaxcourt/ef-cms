const axios = require('axios');

module.exports = async ({ applicationContext, userToken, status }) => {
  return await axios
    .get(`${applicationContext.getBaseUrl()}/cases`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
      params: {
        status,
      },
    })
    .then(response => {
      if (!(response.data && Array.isArray(response.data))) {
        return response.data;
      } else {
        // TODO: remove this once backend can sort
        response.data.sort(function(a, b) {
          return new Date(a.createdAt) - new Date(b.createdAt);
        });
      }
      return response.data;
    });
};
