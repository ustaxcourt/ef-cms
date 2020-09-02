const { put } = require('../requests');

/**
 * strikeDocketEntryInteractor proxy
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.docketNumber the docket number for a case
 * @param {object} providers.documentId the documentId to be stricken
 * @returns {Promise<*>} the promise of the api call
 */
exports.strikeDocketEntryInteractor = ({
  applicationContext,
  docketNumber,
  documentId,
}) => {
  return put({
    applicationContext,
    endpoint: `/case-documents/${docketNumber}/${documentId}/strike`,
  });
};
