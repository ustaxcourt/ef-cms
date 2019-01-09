const Case = require('../../entities/Case');

/**
 * getCasesForRespondent
 * @param userId
 * @param applicationContext
 * @returns {*|Promise<*>}
 */
exports.getCasesForRespondent = async ({ userId, applicationContext }) => {
  const cases = await applicationContext
    .getPersistenceGateway()
    .getCasesForRespondent({
      userId,
      applicationContext,
    });
  return Case.validateRawCollection(cases);
};
