const { get } = require('./requests');

/**
 * getCaseByDocketNumberInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case to retrieve
 * @returns {Promise<*>} the promise of the api call
 */
exports.getCaseByDocketNumberInteractor = ({
  applicationContext,
  docketNumber,
}) => {
  return get({
    applicationContext,
    endpoint: `/cases/docket/${docketNumber}`,
  });
};
