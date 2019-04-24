const { post } = require('../requests');

/**
 * setMessageAsRead
 *
 * @param documents
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.setMessageAsRead = ({ applicationContext, messageId }) => {
  return post({
    applicationContext,
    endpoint: `/messages/${messageId}/read`,
  });
};
