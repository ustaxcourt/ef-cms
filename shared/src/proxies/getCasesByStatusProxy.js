/**
 * getCasesByStatus
 *
 * @param applicationContext
 * @param userId
 * @param status
 * @returns {Promise<*>}
 */
exports.getCasesByStatus = async ({ applicationContext, status }) => {
  return await applicationContext
    .getHttpClient()
    .get(`${applicationContext.getBaseUrl()}/cases`, {
      headers: {
        Authorization: `Bearer ${applicationContext.getCurrentUserToken()}`,
      },
      params: {
        status,
      },
    })
    .then(response => {
      // TODO: this should probably be sorted in a computed
      if (!(response.data && Array.isArray(response.data))) {
        return response.data;
      } else {
        response.data.sort(function(a, b) {
          return new Date(a.createdAt) - new Date(b.createdAt);
        });
      }
      return response.data;
    });
};
