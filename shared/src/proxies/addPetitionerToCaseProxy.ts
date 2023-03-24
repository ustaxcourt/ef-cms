const { post } = require('./requests');

/**
 * addPetitionerToCaseInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseCaption the case caption to update
 * @param {string} providers.docketNumber the docket number of the case to update
 * @param {object} providers.contact the contact to add to the case
 * @returns {Promise<*>} the promise of the api call
 */
exports.addPetitionerToCaseInteractor = (
  applicationContext,
  { caseCaption, contact, docketNumber },
) => {
  return post({
    applicationContext,
    body: { caseCaption, contact },
    endpoint: `/case-meta/${docketNumber}/add-petitioner`,
  });
};
