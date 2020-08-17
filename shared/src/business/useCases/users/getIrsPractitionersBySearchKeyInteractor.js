const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { IrsPractitioner } = require('../../entities/IrsPractitioner');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * getIrsPractitionersBySearchKeyInteractor
 *
 * @param {object} params the params object
 * @param {object} params.applicationContext the application context
 * @param {string} params.searchKey the search string entered by the user
 * @returns {*} the result
 */
exports.getIrsPractitionersBySearchKeyInteractor = async ({
  applicationContext,
  searchKey,
}) => {
  const authenticatedUser = applicationContext.getCurrentUser();

  if (
    !isAuthorized(authenticatedUser, ROLE_PERMISSIONS.ASSOCIATE_USER_WITH_CASE)
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  const users = await applicationContext
    .getPersistenceGateway()
    .getUsersBySearchKey({
      applicationContext,
      searchKey,
      type: 'irsPractitioner',
    });

  return IrsPractitioner.validateRawCollection(users, { applicationContext });
};
