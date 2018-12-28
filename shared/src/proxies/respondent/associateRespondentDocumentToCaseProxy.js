exports.associateRespondentDocumentToCase = async ({
  applicationContext,
  caseId,
  documentType,
  documentId,
  userId,
}) => {
  const userToken = userId;
  const response = await applicationContext.getHttpClient().put(
    `${applicationContext.getBaseUrl()}/cases/${caseId}?interactorName=associateRespondentDocumentToCase`,
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
