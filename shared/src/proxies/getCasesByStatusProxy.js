const { get } = require('./requests');

/**
 * getCasesByStatus
 *
 * @param applicationContext
 * @param userId
 * @param status
 * @returns {Promise<*>}
 */
exports.getCasesByStatus = ({ applicationContext, status }) => {
  return get({
    applicationContext,
    endpoint: `/statuses/${status}/cases`,
    params: {
      status,
    },
  });
};
