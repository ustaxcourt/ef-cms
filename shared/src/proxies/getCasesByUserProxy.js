const axios = require('axios');

exports.getCasesByUser = async ({ applicationContext, userId }) => {
  const userToken = userId; //TODO refactor for jwt

  const response = await axios.get(`${applicationContext.getBaseUrl()}/cases`, {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });
  return response.data;
};
