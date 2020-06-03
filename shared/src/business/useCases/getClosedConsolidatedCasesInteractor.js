const { Case } = require('../entities/cases/Case');

/**
 * getClosedConsolidatedCasesInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {object} the open cases data
 */
exports.getClosedConsolidatedCasesInteractor = async ({
  applicationContext,
}) => {
  let openCases;
  let foundCases = [];

  const { userId } = await applicationContext.getCurrentUser();

  openCases = await applicationContext
    .getPersistenceGateway()
    .getClosedCasesByUser({ applicationContext, userId });

  foundCases = Case.validateRawCollection(openCases, {
    applicationContext,
  });

  return foundCases;
};
