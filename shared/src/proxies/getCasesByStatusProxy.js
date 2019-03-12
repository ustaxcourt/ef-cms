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
  }).then(data => {
    // TODO: this should probably be sorted in a computed
    if (!(data && Array.isArray(data))) {
      return data;
    } else {
      data.sort(function(a, b) {
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
    }
    return data;
  });
};
