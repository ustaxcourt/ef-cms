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

  const barNumber = await applicationContext.barNumberGenerator.createBarNumber(
    {
      applicationContext,
      initials: user.lastName.charAt(0) + user.firstName.charAt(0),
    },
  );
  const practitioner = new Practitioner({
    ...user,
    barNumber,
    isAdmitted: true,
    userId: applicationContext.getUniqueId(),
  }).validate();

  const createdUser = await applicationContext
    .getPersistenceGateway()
    .createPractitionerUser({
      applicationContext,
      user: practitioner.toRawObject(),
    });

  return new Practitioner(createdUser, { applicationContext })
    .validate()
    .toRawObject();
};
