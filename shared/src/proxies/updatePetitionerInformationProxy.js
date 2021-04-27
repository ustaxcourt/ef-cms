const { put } = require('./requests');

/**
 * updatePetitionerInformationInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case to update
 * @param {string} providers.updatedPetitionerData the updatedPetitionerData to update
 * @returns {Promise<*>} the promise of the api call
 */
exports.updatePetitionerInformationInteractor = ({
  applicationContext,
  docketNumber,
  updatedPetitionerData,
}) => {
  return put({
    applicationContext,
    body: { updatedPetitionerData },
    endpoint: `/case-parties/${docketNumber}/petitioner-info`,
  });
};
