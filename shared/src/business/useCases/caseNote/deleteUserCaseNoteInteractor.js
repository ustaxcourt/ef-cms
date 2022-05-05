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

  let { userId } = user;

  if (user.isChambersUser()) {
    const judgeUser = await applicationContext
      .getUseCaseHelpers()
      .getJudgeInSectionHelper(applicationContext, { section: user.section });
    if (judgeUser) {
      ({ userId } = judgeUser);
    }
  }

  return await applicationContext.getPersistenceGateway().deleteUserCaseNote({
    applicationContext,
    docketNumber,
    userId,
  });
};
