/**
 * forwardWorkItem
 *
 * @param userId
 * @param workItemId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.forwardWorkItem = async ({
  userId,
  workItemId,
  assigneeId,
  message,
  applicationContext,
}) => {
  const userToken = userId;
  const response = await applicationContext.getHttpClient().put(
    `${applicationContext.getBaseUrl()}/workitems/${workItemId}?interactorName=forwardWorkItem`,
    {
      assigneeId,
      message,
    },
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    },
  );
  return response.data;
};
