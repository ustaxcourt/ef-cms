const axios = require('axios');

exports.sendPetitionToIRS = async ({ caseId, userId, applicationContext }) => {
  const userToken = userId; //TODO refactor for jwt

  const response = await axios.post(
    `${applicationContext.getBaseUrl()}/cases/${caseId}/irsPetitionPackage`,
    null, //don't send a body
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    },
  );
  return response.data;
};
