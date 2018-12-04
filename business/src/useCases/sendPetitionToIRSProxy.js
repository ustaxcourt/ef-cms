const axios = require('axios');

exports.sendPetitionToIRS = async ({ caseId, userId, applicationContext }) => {
  const response = await axios.post(
    `${applicationContext.getBaseUrl()}/cases/${caseId}/irsPetitionPackage`,
    null, //don't send a body
    {
      headers: {
        Authorization: `Bearer ${userId}`,
      },
    },
  );
  return response.data;
};
