const { get } = require('./requests');

/**
 * getDocumentContentsForDocketEntryInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketEntryId the docket number of the lead case for consolidation
 * @returns {Promise<*>} the promise of the api call
 */
exports.getDocumentContentsForDocketEntryInteractor = ({
  applicationContext,
  docketEntryId,
}) => {
  return get({
    applicationContext,
    endpoint: `/case-documents/${docketEntryId}/document-contents`,
  });
};
