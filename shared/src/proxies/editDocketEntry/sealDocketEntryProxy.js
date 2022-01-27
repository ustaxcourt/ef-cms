const { put } = require('../requests');

/**
 * sealDocketEntryInteractor proxy
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.docketNumber the docket number for a case
 * @param {object} providers.docketEntryId the docketEntryId to be stricken
 * @returns {Promise<*>} the promise of the api call
 */
exports.sealDocketEntryInteractor = (
  applicationContext,
  { docketEntryId, docketEntrySealedTo, docketNumber },
) => {
  return put({
    applicationContext,
    body: {
      docketEntryId,
      docketEntrySealedTo,
      docketNumber,
    },
    endpoint: `/case-documents/${docketNumber}/${docketEntryId}/seal`,
  });
};
