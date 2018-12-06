const axios = require('axios');
/**
 * getDownloadPolicyURL
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getDownloadPolicyUrl = async ({ documentId, applicationContext }) => {
  const response = await axios.get(
    `${applicationContext.getBaseUrl()}/documents/${documentId}/downloadPolicyURL`,
  );
  return response.data;
};
