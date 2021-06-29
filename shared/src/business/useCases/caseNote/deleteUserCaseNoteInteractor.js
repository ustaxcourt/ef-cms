const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * deleteUserCaseNoteInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case the case note is attached to
 * @returns {Promise} the promise of the delete call
 */
exports.deleteUserCaseNoteInteractor = async (
  applicationContext,
  { docketNumber },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSION_WORKING_COPY)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const judgeUser = await applicationContext
    .getUseCases()
    .getJudgeForUserChambersInteractor(applicationContext, { user });

  return await applicationContext.getPersistenceGateway().deleteUserCaseNote({
    applicationContext,
    docketNumber,
    userId: (judgeUser && judgeUser.userId) || user.userId,
  });
};
