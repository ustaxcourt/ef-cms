const {
  isAuthorized,
  PETITION,
} = require('../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../errors/errors');
const Case = require('../entities/Case');

/**
 *
 * @param userId
 * @param procedureType
 * @returns {Promise<[{state, city}]>}
 */
exports.getTrialCities = async ({ procedureType, applicationContext }) => {
  if (!isAuthorized(applicationContext.getCurrentUser(), PETITION)) {
    throw new UnauthorizedError('Unauthorized');
  }

  return Case.getTrialCities(procedureType);
};
