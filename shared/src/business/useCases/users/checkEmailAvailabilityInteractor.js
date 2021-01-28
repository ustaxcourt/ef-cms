const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');
/**
 * checkEmailAvailabilityInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.email the email to check
 * @returns {boolean} true if the email is available; false otherwise
 */
exports.checkEmailAvailabilityInteractor = async ({
  applicationContext,
  email,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.CHECK_EMAIL_AVAILABILITY)
  ) {
    throw new UnauthorizedError('Unauthorized to check for email availability');
  }

  const isEmailInUse = await applicationContext
    .getPersistenceGateway()
    .getCognitoUserByEmail({
      applicationContext,
      email,
    });

  return !isEmailInUse;
};
