const axios = require('axios');

module.exports = async ({ userId, documents, applicationContext }) => {
  const baseUrl = applicationContext.getBaseUrl();
  const headers = {
    Authorization: `Bearer ${userId}`,
  };
  const response = await axios.post(
    `${baseUrl}/cases`,
    {
      documents,
    },
    {
      headers,
    },
  );
  return response.data;
};
