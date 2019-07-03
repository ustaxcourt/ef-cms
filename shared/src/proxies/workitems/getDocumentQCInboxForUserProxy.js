const { get } = require('../requests');

/**
 * getDocumentQCInboxForUserInteractor
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getDocumentQCInboxForUserInteractor = ({
  applicationContext,
  userId,
}) => {
  return get({
    applicationContext,
    endpoint: `/users/${userId}/document-qc/inbox`,
  });
};
