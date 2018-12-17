const axios = require('axios');
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
  userId,
}) => {
  const userToken = userId; // TODO: refactor for jwt
  const response = await axios.put(
    `${applicationContext.getBaseUrl()}/workitems/${
      workItemToUpdate.workItemId
    }`,
    workItemToUpdate,
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    },
  );
  return response.data;
};
