const {
  isAuthorized,
  PETITION,
} = require('../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../errors/errors');
const Case = require('../entities/Case');

/**
 * getCaseTypes
 *
 * @param userId
 * @returns {Promise<*>}
 */
exports.getCaseTypes = async ({ userId }) => {
  if (!isAuthorized(userId, PETITION)) {
    throw new UnauthorizedError('Unauthorized');
  }

  return Case.getCaseTypes();
};
