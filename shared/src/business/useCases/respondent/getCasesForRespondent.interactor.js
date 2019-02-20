const Case = require('../../entities/Case');

/**
 * getCasesForRespondent
 * @param userId
 * @param applicationContext
 * @returns {*|Promise<*>}
 */
exports.getCasesForRespondent = async ({ applicationContext }) => {
  const user = applicationContext.getCurrentUser();

  const cases = await applicationContext
    .getPersistenceGateway()
    .getCasesForRespondent({
      userId: user.userId,
      applicationContext,
    });
  return Case.validateRawCollection(cases);
};
