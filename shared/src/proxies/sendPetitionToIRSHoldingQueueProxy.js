/**
 *
 * @param caseId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.sendPetitionToIRSHoldingQueue = async ({
  caseId,
  applicationContext,
}) => {
  const response = await applicationContext.getHttpClient().post(
    `${applicationContext.getBaseUrl()}/cases/${caseId}/irsPetitionPackage`,
    null, // don't send a body
    {
      headers: {
        Authorization: `Bearer ${applicationContext.getCurrentUserToken()}`,
      },
    },
  );
  return response.data;
};
