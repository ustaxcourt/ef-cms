const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Practitioner } = require('../../entities/Practitioner');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * updateAttorneyUserInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.user the user data
 * @returns {Promise} the promise of the createUser call
 */
exports.updateAttorneyUserInteractor = async ({ applicationContext, user }) => {
  const requestUser = applicationContext.getCurrentUser();
  if (!isAuthorized(requestUser, ROLE_PERMISSIONS.MANAGE_ATTORNEY_USERS)) {
    throw new UnauthorizedError('Unauthorized for updating attorney user');
  }

  const validatedUserData = new Practitioner(user, { applicationContext })
    .validate()
    .toRawObject();

  const updatedUser = await applicationContext
    .getPersistenceGateway()
    .updateAttorneyUser({
      applicationContext,
      user: validatedUserData,
    });

  return new Practitioner(updatedUser, { applicationContext })
    .validate()
    .toRawObject();
};
