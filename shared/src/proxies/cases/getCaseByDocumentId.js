/**
 * getCaseProxy
 *
 * @param applicationContext
 * @param caseId
 * @param userToken
 * @returns {Promise<*>}
 */
exports.getCaseByDocumentId = async ({ applicationContext, documentId }) => {
  const response = await applicationContext
    .getHttpClient()
    .get(`${applicationContext.getBaseUrl()}/documents/${documentId}/cases`, {
      headers: {
        Authorization: `Bearer ${applicationContext.getCurrentUserToken()}`,
      },
    });
  if (response.data.length && response.data.length === 1) {
    return response.data[0];
  } else {
    throw new Error(
      `no cases were found associated with a document of ${documentId}`,
    );
  }
};
