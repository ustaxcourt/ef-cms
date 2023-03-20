const { put } = require('./requests');

/**
 * removePetitionerAndUpdateCaptionInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.caseCaption the updated caseCaption
 * @param {string} providers.contactId the contactId of the petitioner to remove
 * @param {string} providers.docketNumber the docket number of the case to update
 * @returns {Promise<*>} the promise of the api call
 */
exports.removePetitionerAndUpdateCaptionInteractor = (
  applicationContext,
  { caseCaption, contactId, docketNumber },
) => {
  return put({
    applicationContext,
    body: { caseCaption },
    endpoint: `/case-meta/${docketNumber}/remove-petitioner/${contactId}`,
  });
};
