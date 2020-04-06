const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Practitioner } = require('../../entities/Practitioner');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * createPractitionerUserInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.user the user data
 * @returns {Promise} the promise of the createUser call
 */
exports.createPractitionerUserInteractor = async ({
  applicationContext,
  user,
}) => {
  const requestUser = applicationContext.getCurrentUser();
  if (!isAuthorized(requestUser, ROLE_PERMISSIONS.MANAGE_PRACTITIONER_USERS)) {
    throw new UnauthorizedError('Unauthorized for creating practitioner user');
  }

  const createdUser = await applicationContext
    .getPersistenceGateway()
    .createPractitionerUser({
      applicationContext,
      user,
    });

  return new Practitioner(createdUser, { applicationContext })
    .validate()
    .toRawObject();
};
