const { get } = require('../requests');

/**
 * getDocumentQCServedForUserInteractor
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getDocumentQCServedForUserInteractor = ({
  applicationContext,
  userId,
}) => {
  return get({
    applicationContext,
    endpoint: `/users/${userId}/document-qc/served`,
  });
};
