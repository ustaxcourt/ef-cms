const { Case } = require('../entities/Case');

/**
 * getProcedureTypes
 *
 * @param userId
 * @returns {Promise<*>}
 */
exports.getProcedureTypes = async () => {
  return Case.getProcedureTypes();
};
