const { get } = require('../requests');

/**
 *
 * @param applicationContext
 * @param section
 * @returns {Promise<*>}
 */
exports.getSentWorkItemsForSection = ({ applicationContext, section }) => {
  return get({
    applicationContext,
    endpoint: `/sections/${section}/outbox`,
  });
};
