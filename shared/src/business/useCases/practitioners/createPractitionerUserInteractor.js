const {
  createPractitionerUser,
} = require('../../utilities/createPractitionerUser');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Practitioner } = require('../../entities/Practitioner');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * createPractitionerUserInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.user the user data
 * @returns {Promise} the promise of the createUser call
 */
exports.createPractitionerUserInteractor = async (
  applicationContext,
  { user },
) => {
  const requestUser = applicationContext.getCurrentUser();

  if (!isAuthorized(requestUser, ROLE_PERMISSIONS.ADD_EDIT_PRACTITIONER_USER)) {
    throw new UnauthorizedError('Unauthorized for creating practitioner user');
  }

  user.pendingEmail = user.email;
  user.email = undefined;

  const practitioner = await createPractitionerUser({
    applicationContext,
    user,
  });

  const createdUser = await applicationContext
    .getPersistenceGateway()
    .createPractitionerUser({
      applicationContext,
      user: practitioner,
    });

  return new Practitioner(createdUser, { applicationContext })
    .validate()
    .toRawObject();
};
