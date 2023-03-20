const { remove } = require('../requests');

/**
 * deleteCounselFromCaseInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case
 * @param {string} providers.userId the id of the user to delete from the case
 * @returns {Promise<*>} the promise of the api call
 */
exports.deleteCounselFromCaseInteractor = (
  applicationContext,
  { docketNumber, userId },
) => {
  return remove({
    applicationContext,
    endpoint: `/case-parties/${docketNumber}/counsel/${userId}`,
  });
};
