const { post } = require('../requests');

/**
 * createCoverSheetInteractor
 *
 * @param documentId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.createCoverSheetInteractor = ({
  applicationContext,
  caseId,
  documentId,
}) => {
  return post({
    applicationContext,
    endpoint: `/cases/${caseId}/documents/${documentId}/coversheet`,
  });
};
