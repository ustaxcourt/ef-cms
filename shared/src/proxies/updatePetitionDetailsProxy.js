const { put } = require('./requests');

/**
 * updatePetitionDetailsProxy
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to update
 * @param {string} providers.petitionDetails the petition details to update for the case
 * @returns {Promise<*>} the promise of the api call
 */
exports.updatePetitionDetailsInteractor = ({
  applicationContext,
  caseId,
  petitionDetails,
}) => {
  return put({
    applicationContext,
    body: {
      petitionDetails,
    },
    endpoint: `/case-parties/${caseId}/petition-details`,
  });
};
