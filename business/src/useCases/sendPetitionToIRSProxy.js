const axios = require('axios');

exports.sendIRSPetitionPackage = async ({ applicationContext, caseDetails, userToken }) => {
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
