const { get } = require('../requests');

/**
 * getDocumentQCBatchedForUser
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getDocumentQCBatchedForUser = ({ applicationContext, userId }) => {
  return get({
    applicationContext,
    endpoint: `/users/${userId}/document-qc/batched`,
  });
};
