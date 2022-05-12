const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * getJudgeInSectionInteractor - returns the judge user for a given section
 *
 * @param {object} applicationContext the application context
 * @param {object} obj the options object
 * @param {string} obj.section the section to fetch the judge from
 * @returns {User} the judge user in this section provided
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
