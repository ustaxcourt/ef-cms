exports.createDocument = async ({
  applicationContext,
  caseId,
  document,
  userId,
}) => {
  const userToken = userId;
  const response = await applicationContext
    .getHttpClient()
    .post(
      `${applicationContext.getBaseUrl()}/cases/${caseId}/documents`,
      document,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
    );
  return response.data;
};
