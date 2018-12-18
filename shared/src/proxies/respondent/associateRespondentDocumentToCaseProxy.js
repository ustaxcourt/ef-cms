const axios = require('axios');

exports.associateRespondentDocumentToCase = async ({
  applicationContext,
  caseToUpdate,
  userId,
}) => {
  const userToken = userId;
  const response = await axios.put(
    `${applicationContext.getBaseUrl()}/cases/${
      caseToUpdate.caseId
    }?interactorName=associateRespondentDocumentToCase`,
    caseToUpdate,
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    },
  );
  return response.data;
};
