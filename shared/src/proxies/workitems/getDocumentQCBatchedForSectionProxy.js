const { get } = require('../requests');

/**
 * getDocumentQCBatchedForSection
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getDocumentQCBatchedForSection = ({ applicationContext, section }) => {
  return get({
    applicationContext,
    endpoint: `/sections/${section}/document-qc/batched`,
  });
};
