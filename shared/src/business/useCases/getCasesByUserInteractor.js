const { Case } = require('../entities/cases/Case');

/**
 * getCasesByUserInteractor
 * @param userId
 * @param applicationContext
 * @returns {*|Promise<*>}
 */
exports.getCasesByUserInteractor = async ({ applicationContext, userId }) => {
  const cases = await applicationContext
    .getPersistenceGateway()
    .getCasesByUser({
      applicationContext,
      userId,
    });

  return Case.validateRawCollection(cases);
};
