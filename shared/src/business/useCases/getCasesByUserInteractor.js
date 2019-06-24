const { Case } = require('../entities/Case');

/**
 * getCasesByUser
 * @param userId
 * @param applicationContext
 * @returns {*|Promise<*>}
 */
exports.getCasesByUser = async ({ applicationContext, userId }) => {
  const cases = await applicationContext
    .getPersistenceGateway()
    .getCasesByUser({
      applicationContext,
      userId,
    });

  return Case.validateRawCollection(cases);
};
