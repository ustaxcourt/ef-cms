const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

/**
 * createUserInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.user the user data
 * @returns {Promise} the promise of the createUser call
 */
exports.createUserInteractor = async ({ applicationContext, user }) => {
  const requestUser = applicationContext.getCurrentUser();
  if (!isAuthorized(requestUser, ROLE_PERMISSIONS.CREATE_USER)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const createdUser = await applicationContext
    .getPersistenceGateway()
    .createUser({
      applicationContext,
      user,
    });

  //check role
  //new up entity based on role
  //validate entity
  //create new User from that created entity - dont forget to add validation for role type in both entities
  //MAYBE return? check if return value being used (probably returning for logging)
  //after, try running setup cognito users.sh maybe on exp branch

  return new User(createdUser, { applicationContext }).validate().toRawObject();
};
