const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { MAX_SEARCH_RESULTS } = require('../../entities/EntityConstants');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * getPractitionersByNameInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} params the params object
 * @param {string} params.name the name to search by
 * @returns {*} the result
 */
exports.getPractitionersByNameInteractor = async (
  applicationContext,
  { name },
) => {
  const authenticatedUser = applicationContext.getCurrentUser();

  if (
    !isAuthorized(authenticatedUser, ROLE_PERMISSIONS.MANAGE_PRACTITIONER_USERS)
  ) {
    throw new UnauthorizedError('Unauthorized for searching practitioners');
  }

  if (!name) {
    throw new Error('Name must be provided to search');
  }

  const foundUsers = (
    await applicationContext.getPersistenceGateway().getPractitionersByName({
      applicationContext,
      name,
    })
  ).slice(0, MAX_SEARCH_RESULTS);

  return foundUsers.map(foundUser => ({
    admissionsStatus: foundUser.admissionsStatus,
    barNumber: foundUser.barNumber,
    contact: {
      state: foundUser.contact.state,
    },
    name: foundUser.name,
  }));
};
