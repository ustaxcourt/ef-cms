const axios = require('axios');

module.exports = async ({ applicationContext, caseId, userToken }) => {
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
