const axios = require('axios');

exports.sendPetitionToIRS = async ({ applicationContext, caseDetails, userToken }) => {
  console.log('we are here');
  const response = await axios.post(
    `${applicationContext.getBaseUrl()}/cases/${
      caseDetails.caseId
    }/irsPetitionPackage`,
    null, //don't send a body
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    },
  );
  return response.data;
};
