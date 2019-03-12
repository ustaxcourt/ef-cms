const { put } = require('../requests');

/**
 * getWorkItem
 *
 * @param userId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.assignWorkItems = ({ workItems, applicationContext }) => {
  return put({
    applicationContext,
    body: workItems,
    endpoint: '/workitems',
  });
};
