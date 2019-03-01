/**
 * createCaseProxy
 *
 * @param documents
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.createCase = async ({
  petitionMetadata,
  petitionFileId,
  ownershipDisclosureFileId,
  applicationContext,
}) => {
  const response = await applicationContext.getHttpClient().post(
    `${applicationContext.getBaseUrl()}/cases`,
    {
      ownershipDisclosureFileId,
      petitionFileId,
      petitionMetadata,
    },
    {
      headers: {
        Authorization: `Bearer ${applicationContext.getCurrentUserToken()}`,
      },
    },
  );
  return response.data;
};
