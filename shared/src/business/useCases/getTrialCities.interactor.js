const {
  isAuthorized,
  PETITION,
} = require('../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../errors/errors');
const Case = require('../entities/Case');

/**
 * getTrialCities
 * @param userId
 * @param procedureType
 * @returns {Promise<[{state, city}]>}
 */
exports.getTrialCities = async ({ userId, procedureType }) => {
  if (!isAuthorized(userId, PETITION)) {
    throw new UnauthorizedError('Unauthorized');
  }

  return Case.getTrialCities(procedureType);
};
