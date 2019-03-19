const { get } = require('../requests');

/**
 *
 * @param applicationContext
 * @param section
 * @returns {Promise<*>}
 */
exports.getWorkItemsBySection = ({ applicationContext, section }) => {
  return get({
    applicationContext,
    endpoint: `/sections/${section}/inbox`,
  });
};
