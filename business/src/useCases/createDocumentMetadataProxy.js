const axios = require('axios');

module.exports = async ({ applicationContext, userToken, documentType }) => {
  const response = await axios.post(
    `${applicationContext.getBaseUrl()}/documents`,
    {
      documentType,
    },
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    },
  );
  return response.data;
};
