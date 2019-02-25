const {
  isAuthorized,
  PETITION,
} = require('../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../errors/errors');
const Case = require('../entities/Case');

/**
 * getProcedureTypes
 *
 * @param userId
 * @returns {Promise<*>}
 */
exports.getProcedureTypes = async ({ applicationContext }) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, PETITION)) {
    throw new UnauthorizedError('Unauthorized');
  }

  return Case.getProcedureTypes();
};
