const { put } = require('./requests');

/**
 * archiveDraftDocumentInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case
 * @param {string} providers.docketEntryId the docket entry id to archive
 * @returns {Promise<*>} the promise of the api call
 */
exports.archiveDraftDocumentInteractor = (
  applicationContext,
  { docketEntryId, docketNumber },
) => {
  return put({
    applicationContext,
    endpoint: `/case-documents/${docketNumber}/${docketEntryId}`,
  });
};
