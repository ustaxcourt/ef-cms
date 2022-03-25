const { get } = require('../requests');
const { startCase } = require('lodash');

/**
 * getTrialSessionsByStatusInteractor
 *
 * @param {object} applicationContext the application context
 * @returns {Promise<*>} the promise of the api call
 */
exports.getTrialSessionsByStatusInteractor = (
  applicationContext,
  { status },
) => {
  return get({
    applicationContext,
    endpoint: '/trial-sessions',
    params: {
      status: startCase(status),
    },
  });
};
