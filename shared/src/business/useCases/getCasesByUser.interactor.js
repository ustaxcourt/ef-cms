const Case = require('../entities/Case');

/**
 * getCasesByUser
 * @param userId
 * @param applicationContext
 * @returns {*|Promise<*>}
 */
exports.getCasesByUser = async ({ userId, applicationContext }) => {
  const cases = await applicationContext
    .getPersistenceGateway()
    .getCasesByUser({
      userId,
      applicationContext,
    });

  return Case.validateRawCollection(cases);
};
