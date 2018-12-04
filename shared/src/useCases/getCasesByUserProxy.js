const axios = require('axios');

module.exports = async ({ applicationContext, userId }) => {
  const response = await axios.get(`${applicationContext.getBaseUrl()}/cases`, {
    headers: {
      Authorization: `Bearer ${userId}`,
    },
  });
  return response.data;
};
