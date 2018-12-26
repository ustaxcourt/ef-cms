const axios = require('axios');

exports.associatDocumentToCase = async ({
  applicationContext,
  caseId,
  documentType,
  documentId,
  userId,
}) => {
  const userToken = userId;
  const response = await axios.put(
    `${applicationContext.getBaseUrl()}/cases/${caseId}?interactorName=associateDocumentToCase`,
    {
      documentType,
      documentId,
    },
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    },
  );
  return response.data;
};
