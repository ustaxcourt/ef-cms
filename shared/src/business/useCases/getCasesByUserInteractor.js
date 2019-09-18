const { Case } = require('../entities/cases/Case');

/**
 * getCasesByUserInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.userId id of the user to get cases for
 * @returns {Array<object>} the cases the user is associated with
 */
exports.getCasesByUserInteractor = async ({ applicationContext, userId }) => {
  const cases = await applicationContext
    .getPersistenceGateway()
    .getCasesByUser({
      applicationContext,
      userId,
    });

  return Case.validateRawCollection(cases, { applicationContext });
};
