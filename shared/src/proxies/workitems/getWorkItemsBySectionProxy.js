/**
 *
 * @param applicationContext
 * @param section
 * @returns {Promise<*>}
 */
exports.getWorkItemsBySection = async ({ applicationContext, section }) => {
  const response = await applicationContext
    .getHttpClient()
    .get(`${applicationContext.getBaseUrl()}/sections/${section}/inbox`, {
      headers: {
        Authorization: `Bearer ${applicationContext.getCurrentUserToken()}`,
      },
    });
  return response.data;
};
