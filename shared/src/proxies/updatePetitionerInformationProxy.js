const { put } = require('./requests');

/**
 * updatePetitionerInformationInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case to update
 * @param {string} providers.contactPrimary the primary contact information to update
 * @param {string} providers.contactSecondary the secondary contact information to update
 * @param {string} providers.partyType the party type to update
 * @returns {Promise<*>} the promise of the api call
 */
exports.updatePetitionerInformationInteractor = ({
  applicationContext,
  contactPrimary,
  contactSecondary,
  docketNumber,
  partyType,
}) => {
  return put({
    applicationContext,
    body: { contactPrimary, contactSecondary, partyType },
    endpoint: `/case-parties/${docketNumber}/petitioner-info`,
  });
};
