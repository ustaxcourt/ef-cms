const axios = require('axios');

module.exports = async ({ userId, documents, applicationContext }) => {
  const response = await axios.post(
    `${applicationContext.getBaseUrl()}/cases`,
    {
      documents,
    },
    {
      headers: {
        Authorization: `Bearer ${userId}`,
      },
    },
  );
  return response.data;
};
