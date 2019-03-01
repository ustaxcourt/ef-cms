const Case = require('../entities/Case');

/**
 *
 * @param userId
 * @param procedureType
 * @returns {Promise<[{state, city}]>}
 */
exports.getTrialCities = async ({ procedureType }) => {
  return Case.getTrialCities(procedureType);
};
