const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { UnauthorizedError } = require('../../errors/errors');

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {Array<string>} the filing type options based on user role
 */
exports.getFilingTypesInteractor = async ({ applicationContext }) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.PETITION)) {
    throw new UnauthorizedError('Unauthorized');
  }

  return Case.getFilingTypes(user.role);
};
