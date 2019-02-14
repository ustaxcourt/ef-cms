/**
 * updateWorkItem
 *
 * @param applicationContext
 * @param workItemToUpdate
 * @param userId
 * @returns {Promise<*>}
 */
exports.updateWorkItem = async ({
  applicationContext,
  workItemToUpdate,
  workItemId,
}) => {
  const response = await applicationContext
    .getHttpClient()
    .put(
      `${applicationContext.getBaseUrl()}/workitems/${workItemId}`,
      workItemToUpdate,
      {
        headers: {
          Authorization: `Bearer ${applicationContext.getCurrentUserToken()}`,
        },
      },
    );
  return response.data;
};
