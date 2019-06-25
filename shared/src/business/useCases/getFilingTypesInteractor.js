const {
  isAuthorized,
  PETITION,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { UnauthorizedError } = require('../../errors/errors');

/**
 *
 * @param userId
 * @returns {Promise<*>}
 */
exports.getFilingTypes = async ({ applicationContext }) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, PETITION)) {
    throw new UnauthorizedError('Unauthorized');
  }

  return Case.getFilingTypes(user.role);
};
