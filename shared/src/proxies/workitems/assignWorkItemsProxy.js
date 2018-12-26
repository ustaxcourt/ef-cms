const axios = require('axios');

/**
 * getWorkItem
 *
 * @param userId
 * @param workItemId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.assignWorkItems = async ({ userId, workItems, applicationContext }) => {
  const userToken = userId;
  const response = await axios.put(
    `${applicationContext.getBaseUrl()}/workitems`,
    workItems,
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    },
  );
  return response.data;
};
