const { get } = require('../requests');

/**
 * getDocumentQCBatchedForSectionInteractor
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getDocumentQCBatchedForSectionInteractor = ({
  applicationContext,
  section,
}) => {
  return get({
    applicationContext,
    endpoint: `/sections/${section}/document-qc/batched`,
  });
};
