const axios = require('axios');

/**
 * getWorkItem
 *
 * @param userId
 * @param workItemId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.assignWorkItems = async ({
  userId,
  assigneeId,
  assigneeName,
  workItemIds,
  applicationContext,
}) => {
  const userToken = userId;
  const response = await axios.post(
    `${applicationContext.getBaseUrl()}/assignWorkItems`,
    {
      workItemIds,
      assigneeId,
      assigneeName,
    },
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    },
  );
  return response.data;
};
