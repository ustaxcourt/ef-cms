const qs = require('qs');
const { get } = require('../requests');

/**
 * getNotificationsInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.judgeUserId optional judge user id to filter on
 * @returns {Promise<*>} the promise of the api call
 */
exports.getNotificationsInteractor = (
  applicationContext,
  { caseServicesSupervisorInfo, judgeUserId },
) => {
  const queryString = qs.stringify({
    caseServicesSupervisorInfo,
    judgeUserId,
  });

  return get({
    applicationContext,
    endpoint: `/api/notifications?${queryString}`,
  });
};
