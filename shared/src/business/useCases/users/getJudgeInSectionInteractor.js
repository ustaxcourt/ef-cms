const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * getJudgeForUserChambersInteractor - returns the judge user for a given user in a chambers section
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @returns {User} the judge user for the given chambers user
 */

exports.getJudgeInSectionInteractor = async (
  applicationContext,
  { section },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.GET_USERS_IN_SECTION)) {
    throw new UnauthorizedError('Unauthorized');
  }

  return await applicationContext
    .getUseCaseHelpers()
    .getJudgeInSectionHelper(applicationContext, { section });
};
