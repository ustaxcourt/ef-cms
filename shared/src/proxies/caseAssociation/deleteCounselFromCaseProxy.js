const { remove } = require('../requests');

/**
 * deleteCounselFromCaseInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case
 * @param {string} providers.userId the id of the user to delete from the case
 * @returns {Promise<*>} the promise of the api call
 */
exports.deleteCounselFromCaseInteractor = ({
  applicationContext,
  docketNumber,
  userId,
}) => {
  return remove({
    applicationContext,
    endpoint: `/case-parties/${docketNumber}/counsel/${userId}`,
  });
};
