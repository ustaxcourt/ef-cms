const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { IrsPractitioner } = require('../../entities/IrsPractitioner');
const { Practitioner } = require('../../entities/Practitioner');
const { PrivatePractitioner } = require('../../entities/PrivatePractitioner');
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

  let userEntity = createdUser;

  //check role
  //new up entity based on role
  //validate entity
  if (user.role === User.ROLES.privatePractitioner) {
    userEntity = new PrivatePractitioner(createdUser, {
      applicationContext,
    })
      .validate()
      .toRawObject();
  } else if (user.role === User.ROLES.irsPractitioner) {
    userEntity = new IrsPractitioner(createdUser, { applicationContext })
      .validate()
      .toRawObject();
  } else if (user.role === User.ROLES.inactivePractitioner) {
    userEntity = new Practitioner(createdUser, { applicationContext })
      .validate()
      .toRawObject();
  }

  //create new User from that created entity - don't forget to add validation for role type in both entities
  //MAYBE return? check if return value being used (probably returning for logging)
  return new User(userEntity, { applicationContext }).validate().toRawObject();

  //after, try running setup cognito users.sh maybe on exp branch
};
