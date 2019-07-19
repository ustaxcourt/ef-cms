const { put } = require('./requests');

/**
 * updatePrimaryContactInteractor
 *
 * @param applicationContext
 * @param caseId
 * @param documentId
 * @returns {Promise<*>}
 */
exports.serveSignedStipDecisionInteractor = ({
  applicationContext,
  caseId,
  documentId,
}) => {
  return put({
    applicationContext,
    body: { caseId, documentId },
    endpoint: `/cases/${caseId}/serve/${documentId}`,
  });
};
