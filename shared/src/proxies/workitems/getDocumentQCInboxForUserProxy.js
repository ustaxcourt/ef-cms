const { get } = require('../requests');

/**
 * getDocumentQCInboxForUser
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getDocumentQCInboxForUser = ({ applicationContext, userId }) => {
  return get({
    applicationContext,
    endpoint: `/users/${userId}/document-qc/inbox`,
  });
};
