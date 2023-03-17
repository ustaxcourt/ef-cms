const { get } = require('../requests');

/**
 * getCaseForPublicDocketSearchInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number to search by
 * @returns {Promise<*>} the promise of the api call
 */
exports.getCaseForPublicDocketSearchInteractor = ({
  applicationContext,
  docketNumber,
}) => {
  return get({
    applicationContext,
    endpoint: `/public-api/docket-number-search/${docketNumber}`,
  });
};
