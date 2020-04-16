const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

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
  if (!isAuthorized(user, ROLE_PERMISSIONS.GET_JUDGES)) {
    throw new UnauthorizedError('Unauthorized');
  }
  const rawUsers = await applicationContext
    .getPersistenceGateway()
    .getUsersInSection({
      applicationContext,
      section,
    });

  return User.validateRawCollection(rawUsers, { applicationContext });
};
