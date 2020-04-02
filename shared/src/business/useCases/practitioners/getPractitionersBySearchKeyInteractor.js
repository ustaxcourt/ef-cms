const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

/**
 * getPractitionersBySearchKeyInteractor
 *
 * @param {object} params the params object
 * @param {object} params.applicationContext the application context
 * @param {string} params.barNumber the bar number to search by
 * @param {string} params.name the name to search by
 * @returns {*} the result
 */
exports.getPractitionersBySearchKeyInteractor = async ({
  applicationContext,
  barNumber,
  name,
}) => {
  const authenticatedUser = applicationContext.getCurrentUser();

  if (
    !isAuthorized(authenticatedUser, ROLE_PERMISSIONS.MANAGE_ATTORNEY_USERS)
  ) {
    throw new UnauthorizedError('Unauthorized for searching practitioners');
  }

  //elasticsearch call
  const users = [];

  return User.validateRawCollection(users, { applicationContext });
};
