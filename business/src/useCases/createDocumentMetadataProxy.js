const axios = require('axios');

module.exports = async ({ applicationContext, userId, documentType }) => {
  const response = await axios.post(
    `${applicationContext.getBaseUrl()}/documents`,
    {
      userId,
      documentType,
    },
  );
  return response.data;
};
