const { get } = require('../requests');

/**
 * getMaintenanceModeInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @returns {Promise<*>} the promise of the api call
 */
exports.getMaintenanceModeInteractor = applicationContext => {
  return get({
    applicationContext,
    endpoint: '/maintenance-mode',
  });
};
