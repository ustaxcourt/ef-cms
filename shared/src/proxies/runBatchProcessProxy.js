const { post } = require('./requests');

/**
 * runBatchProcess
 *
 * @param applicationContext
 * @param caseId
 * @param userId
 * @returns {Promise<*>}
 */
exports.runBatchProcess = ({ applicationContext }) => {
  return post({
    applicationContext,
    endpoint: '/runBatchProcess',
  });
};
