const { post } = require('../requests');

/**
 * createJudgeUserProxy
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.user the user data
 * @returns {Promise<object>} the created user data
 */
exports.createJudgeUserInteractor = ({ applicationContext, user }) => {
  return post({
    applicationContext,
    body: { user },
    endpoint: '/judges',
  });
};
