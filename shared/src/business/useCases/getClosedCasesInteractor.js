const { CASE_STATUS_TYPES } = require('../entities/EntityConstants');
const { UserCase } = require('../entities/UserCase');

/**
 * getClosedCasesInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {object} the closed cases data
 */
exports.getClosedCasesInteractor = async ({ applicationContext }) => {
  let closedCases;
  let foundCases = [];

  const { userId } = await applicationContext.getCurrentUser();

  closedCases = await applicationContext
    .getPersistenceGateway()
    .getIndexedCasesForUser({
      applicationContext,
      statuses: [CASE_STATUS_TYPES.closed],
      userId,
    });

  foundCases = UserCase.validateRawCollection(closedCases, {
    applicationContext,
  });

  return foundCases;
};
