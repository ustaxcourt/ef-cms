const { get } = require('../requests');

/**
 * getDocumentQCServedForSectionInteractor
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getDocumentQCServedForSectionInteractor = ({
  applicationContext,
  section,
}) => {
  return get({
    applicationContext,
    endpoint: `/sections/${section}/document-qc/served`,
  });
};
