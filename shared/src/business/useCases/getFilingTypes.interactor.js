const {
  isAuthorized,
  PETITION,
} = require('../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../errors/errors');
const Case = require('../entities/Case');

/**
 *
 * @param userId
 * @returns {Promise<*>}
 */
exports.getFilingTypes = async ({ userId }) => {
  if (!isAuthorized(userId, PETITION)) {
    throw new UnauthorizedError('Unauthorized');
  }

  return Case.getFilingTypes();
};
