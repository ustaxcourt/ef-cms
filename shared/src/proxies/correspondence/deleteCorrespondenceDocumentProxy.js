const { remove } = require('../requests');

/**
 * deleteCorrespondenceDocumentInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.docketNumber the docket number of the case that contains the document to delete
 * @param {string} providers.documentId the id of the correspondence document
 * @returns {Promise<*>} the promise of the api call
 */
exports.deleteCorrespondenceDocumentInteractor = ({
  applicationContext,
  docketNumber,
  documentId,
}) => {
  return remove({
    applicationContext,
    endpoint: `/case-documents/${docketNumber}/correspondence/${documentId}`,
  });
};
