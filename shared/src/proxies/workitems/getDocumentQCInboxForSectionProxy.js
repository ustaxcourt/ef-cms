const { get } = require('../requests');

/**
 * getDocumentQCInboxForSectionInteractor
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getDocumentQCInboxForSectionInteractor = ({
  applicationContext,
  section,
}) => {
  return get({
    applicationContext,
    endpoint: `/api/sections/${section}/document-qc/inbox`,
  });
};
