const axios = require('axios');

module.exports = async ({ userId, documents, applicationContext }) => {
  const headers = {
    Authorization: `Bearer ${userId}`,
  };
  const response = await axios.post(
    `${applicationContext.getBaseUrl()}/cases`,
    {
      documents,
    },
    {
      headers,
    },
  );
  return response.data;
};
