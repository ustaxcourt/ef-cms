const axios = require('axios');

/**
 * getWorkItemProxy
 *
 * @param applicationContext
 * @param workItemId
 * @param userToken
 * @returns {Promise<*>}
 */
exports.getCase = async ({ applicationContext, workItemId, userId }) => {
  const userToken = userId; //TODO refactor for jwt
  const response = await axios.get(
    `${applicationContext.getBaseUrl()}/workitems/${workItemId}`,
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    },
  );
  return response.data;
};
