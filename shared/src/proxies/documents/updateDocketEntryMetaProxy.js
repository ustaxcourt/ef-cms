const { put } = require('../requests');

/**
 * updateDocketEntryMetaProxy
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.docketNumber the docket number of the case to be updated
 * @param {object} providers.docketRecordIndex the index of the docket record entry to be updated
 * @param {object} providers.docketEntryMeta the docket entry metadata
 * @returns {Promise<*>} the promise of the api call
 */
exports.updateDocketEntryMetaInteractor = (
  applicationContext,
  { docketEntryMeta, docketNumber, docketRecordIndex },
) => {
  return put({
    applicationContext,
    body: {
      docketEntryMeta,
      docketRecordIndex,
    },
    endpoint: `/case-documents/${docketNumber}/docket-entry-meta`,
  });
};
