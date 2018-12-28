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
  userId,
}) => {
  const userToken = userId; // TODO: refactor for jwt
  const response = await applicationContext
    .getHttpClient()
    .put(
      `${applicationContext.getBaseUrl()}/workitems/${workItemId}`,
      workItemToUpdate,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
    );
  return response.data;
};
