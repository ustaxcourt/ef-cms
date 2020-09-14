const { get } = require('../requests');

/**
 * getNotificationsInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {Promise<*>} the promise of the api call
 */
exports.getNotificationsInteractor = ({ applicationContext, judgeUser }) => {
  return get({
    applicationContext,
    endpoint: '/api/notifications',
    judgeUser,
  });
};
