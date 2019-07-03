const { get } = require('../requests');

/**
 * getDocumentQCServedForSection
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getDocumentQCServedForSection = ({ applicationContext, section }) => {
  return get({
    applicationContext,
    endpoint: `/sections/${section}/document-qc/served`,
  });
};
