/**
 *
 * @param applicationContext
 * @param completedMessage
 * @param workItemId
 * @param userId
 * @returns {Promise<*>}
 */
exports.completeWorkItem = async ({
  applicationContext,
  completedMessage,
  workItemId,
}) => {
  const response = await applicationContext.getHttpClient().put(
    `${applicationContext.getBaseUrl()}/workitems/${workItemId}/complete`,
    { completedMessage },
    {
      headers: {
        Authorization: `Bearer ${applicationContext.getCurrentUserToken()}`,
      },
    },
  );
  return response.data;
};
