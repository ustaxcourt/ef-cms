const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * getPractitionersByNameInteractor
 *
 * @param {object} params the params object
 * @param {object} params.applicationContext the application context
 * @param {string} params.name the name to search by
 * @returns {*} the result
 */
exports.getPractitionersByNameInteractor = async ({
  applicationContext,
  name,
}) => {
  const authenticatedUser = applicationContext.getCurrentUser();

  if (
    !isAuthorized(authenticatedUser, ROLE_PERMISSIONS.MANAGE_PRACTITIONER_USERS)
  ) {
    throw new UnauthorizedError('Unauthorized for searching practitioners');
  }

  if (!name) {
    throw new Error('Name must be provided to search');
  }

  const foundUsers = applicationContext
    .getPersistenceGateway()
    .getPractitionersByName({
      applicationContext,
      name,
    });

  return foundUsers;
};
