const Case = require('../entities/Case');

/**
 * getCasesByUser
 * @param userId
 * @param applicationContext
 * @returns {*|Promise<*>}
 */
exports.getCasesByUser = async ({ user, applicationContext }) => {
  const cases = await applicationContext
    .getPersistenceGateway()
    .getCasesByUser({
      user,
      applicationContext,
    });

  return Case.validateRawCollection(cases);
};
