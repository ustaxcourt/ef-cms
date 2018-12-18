const axios = require('axios');

exports.updateCase = async ({ applicationContext, caseToUpdate, userId }) => {
  const userToken = userId; // TODO: refactor for jwt
  const response = await axios.put(
    `${applicationContext.getBaseUrl()}/cases/${caseToUpdate.caseId}`,
    caseToUpdate,
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    },
  );
  return response.data;
};
