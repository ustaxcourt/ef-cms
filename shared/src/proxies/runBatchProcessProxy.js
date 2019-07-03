const { post } = require('./requests');

/**
 * runBatchProcessInteractor
 *
 * @param applicationContext
 * @param caseId
 * @param userId
 * @returns {Promise<*>}
 */
exports.runBatchProcessInteractor = ({ applicationContext }) => {
  return post({
    applicationContext,
    endpoint: '/runBatchProcess',
  });
};
