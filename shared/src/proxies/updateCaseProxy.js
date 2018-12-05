const axios = require('axios');

exports.updateCase = async ({ applicationContext, caseDetails, userId }) => {
  const userToken = userId; //TODO refactor for jwt

  const response = await axios.put(
    `${applicationContext.getBaseUrl()}/cases/${caseDetails.caseId}`,
    caseDetails,
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    },
  );
  return response.data;
};
