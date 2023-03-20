const { put } = require('../requests');

/**
 * strikeDocketEntryInteractor proxy
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.docketNumber the docket number for a case
 * @param {object} providers.docketEntryId the docketEntryId to be stricken
 * @returns {Promise<*>} the promise of the api call
 */
exports.strikeDocketEntryInteractor = (
  applicationContext,
  { docketEntryId, docketNumber },
) => {
  return put({
    applicationContext,
    endpoint: `/case-documents/${docketNumber}/${docketEntryId}/strike`,
  });
};
