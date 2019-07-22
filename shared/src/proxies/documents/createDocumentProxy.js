const { post } = require('../requests');
/**
 *
 * @param applicationContext
 * @param caseId
 * @param document
 * @param userId
 * @returns {Promise<*>}
 */
exports.createDocumentInteractor = ({
  applicationContext,
  caseId,
  document,
}) => {
  return post({
    applicationContext,
    body: document,
    endpoint: `/cases/${caseId}/documents`,
  });
};
