const { remove } = require('../requests');

/**
 * archiveCorrespondenceDocumentProxy
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.docketNumber the docket number of the case that contains the document to archive
 * @param {string} providers.correspondenceId the id of the correspondence document
 * @returns {Promise<*>} the promise of the api call
 */
exports.archiveCorrespondenceDocumentInteractor = (
  applicationContext,
  { correspondenceId, docketNumber },
) => {
  return remove({
    applicationContext,
    endpoint: `/case-documents/${docketNumber}/correspondence/${correspondenceId}`,
  });
};
