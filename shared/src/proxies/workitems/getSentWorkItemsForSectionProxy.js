/**
 *
 * @param applicationContext
 * @param section
 * @returns {Promise<*>}
 */
exports.getSentWorkItemsForSection = async ({
  applicationContext,
  section,
}) => {
  const response = await applicationContext
    .getHttpClient()
    .get(
      `${applicationContext.getBaseUrl()}/workitems?completed=true&section=${section}`,
      {
        headers: {
          Authorization: `Bearer ${applicationContext.getCurrentUserToken()}`,
        },
      },
    );
  return response.data;
};
