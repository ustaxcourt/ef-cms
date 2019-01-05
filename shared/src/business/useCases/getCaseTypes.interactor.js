const {
  isAuthorized,
  GET_CASE,
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
  if (!isAuthorized(userId, GET_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  return Case.getCaseTypes();
};
