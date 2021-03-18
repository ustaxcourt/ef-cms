const { get } = require('../requests');

/**
 * getTodaysOrdersInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {Promise<*>} the promise of the api call
 */
exports.getTodaysOrdersInteractor = ({
  applicationContext,
  page,
  sortOrder,
}) => {
  return get({
    applicationContext,
    endpoint: `/public-api/todays-orders/${page}/${sortOrder}`,
  });
};
