const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');
/**
 * getUsersInSectionInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.section the section to get the users
 * @returns {Promise} the promise of the getUsersInSection call
 */
exports.getUsersInSectionInteractor = async ({
  applicationContext,
  section,
}) => {
  const user = applicationContext.getCurrentUser();
  if (!isAuthorized(user, ROLE_PERMISSIONS.GET_USERS_IN_SECTION)) {
    throw new UnauthorizedError('Unauthorized');
  }
  return await applicationContext.getPersistenceGateway().getUsersInSection({
    applicationContext,
    section,
  });
};
