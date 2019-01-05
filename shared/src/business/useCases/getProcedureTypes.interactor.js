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
exports.getProcedureTypes = async ({ userId }) => {
  if (!isAuthorized(userId, PETITION)) {
    throw new UnauthorizedError('Unauthorized');
  }

  return Case.getProcedureTypes();
};