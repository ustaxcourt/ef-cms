const { remove } = require('./requests');

/**
 * removePetitionerFromCaseInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case to update
 * @param {object} providers.contactId the contactId to remove from the case
 * @returns {Promise<*>} the promise of the api call
 */
exports.removePetitionerFromCaseInteractor = ({
  applicationContext,
  caseCaption,
  contactId,
  docketNumber,
}) => {
  return remove({
    applicationContext,
    body: { caseCaption },
    endpoint: `/case-meta/${docketNumber}/remove-petitioner/${contactId}`,
  });
};
