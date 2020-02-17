const { remove } = require('./requests');

/**
 * removeCasePendingItemInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to update
 * @param {string} providers.documentId the id of document no longer pending
 * @returns {Promise<object>} the updated case data
 */
exports.removeCasePendingItemInteractor = ({
  applicationContext,
  caseId,
  documentId,
}) => {
  return remove({
    applicationContext,
    endpoint: `/cases/${caseId}/remove-pending/${documentId}`,
  });
};
