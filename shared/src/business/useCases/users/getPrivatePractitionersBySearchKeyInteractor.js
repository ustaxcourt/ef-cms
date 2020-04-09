const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

/**
 * getPrivatePractitionersBySearchKeyInteractor
 *
 * @param {object} params the params object
 * @param {object} params.applicationContext the application context
 * @param {string} params.searchKey the search string entered by the user
 * @returns {*} the result
 */
exports.getPrivatePractitionersBySearchKeyInteractor = async ({
  applicationContext,
  searchKey,
}) => {
  const authenticatedUser = applicationContext.getCurrentUser();

  if (
    !isAuthorized(authenticatedUser, ROLE_PERMISSIONS.ASSOCIATE_USER_WITH_CASE)
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  const users = await applicationContext
    .getPersistenceGateway()
    .getUsersBySearchKey({
      applicationContext,
      searchKey,
      type: 'privatePractitioner',
    });

  return User.validateRawCollection(users, { applicationContext });
};
