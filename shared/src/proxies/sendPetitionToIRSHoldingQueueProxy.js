exports.sendPetitionToIRSHoldingQueue = async ({
  caseId,
  userId,
  applicationContext,
}) => {
  const userToken = userId; //TODO refactor for jwt

  const response = await applicationContext.getHttpClient().post(
    `${applicationContext.getBaseUrl()}/cases/${caseId}/irsPetitionPackage`,
    null, // don't send a body
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    },
  );
  return response.data;
};
