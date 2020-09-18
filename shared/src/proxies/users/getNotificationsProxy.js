const { get } = require('../requests');

/**
 * getNotificationsInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.judgeUserId optional judge user id to filter on
 * @returns {Promise<*>} the promise of the api call
 */
exports.getNotificationsInteractor = ({ applicationContext, judgeUserId }) => {
  let queryString = '';
  if (judgeUserId) {
    queryString = '?judgeUserId=' + encodeURIComponent(judgeUserId);
  }

  return get({
    applicationContext,
    endpoint: `/api/notifications${queryString}`,
  });
};
