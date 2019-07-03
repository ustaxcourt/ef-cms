const { get } = require('../requests');

/**
 * getDocumentQCServedForUser
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getDocumentQCServedForUser = ({ applicationContext, userId }) => {
  return get({
    applicationContext,
    endpoint: `/users/${userId}/document-qc/served`,
  });
};
