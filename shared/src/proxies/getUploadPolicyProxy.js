const axios = require('axios');
/**
 * getUploadPolicy
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getUploadPolicy = async ({ applicationContext }) => {
  const response = await axios.get(
    `${applicationContext.getBaseUrl()}/documents/uploadPolicy`,
  );
  return response.data;
};
