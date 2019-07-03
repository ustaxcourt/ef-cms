const { get } = require('../requests');

/**
 * getDocumentQCInboxForSection
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getDocumentQCInboxForSection = ({ applicationContext, section }) => {
  return get({
    applicationContext,
    endpoint: `/sections/${section}/document-qc/inbox`,
  });
};
