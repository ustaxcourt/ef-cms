const { get } = require('../requests');

/**
 * getDocumentQCBatchedForUserInteractor
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getDocumentQCBatchedForUserInteractor = ({
  applicationContext,
  userId,
}) => {
  return get({
    applicationContext,
    endpoint: `/users/${userId}/document-qc/batched`,
  });
};
