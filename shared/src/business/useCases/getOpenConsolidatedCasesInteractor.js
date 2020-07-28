const { UserCase } = require('../entities/UserCase');

/**
 * getOpenConsolidatedCasesInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {object} the open cases data
 */
exports.getOpenConsolidatedCasesInteractor = async ({ applicationContext }) => {
  const { userId } = await applicationContext.getCurrentUser();

  let openUserCases = await applicationContext
    .getPersistenceGateway()
    .getIndexedCasesForUser({
      applicationContext,
      statuses: applicationContext.getConstants().OPEN_CASE_STATUSES,
      userId,
    });

  openUserCases = UserCase.validateRawCollection(openUserCases, {
    applicationContext,
  });

  if (!openUserCases.length) {
    return [];
  }

  let {
    casesAssociatedWithUserOrLeadCaseMap,
    leadDocketNumbersAssociatedWithUser,
    userAssociatedDocketNumbersMap,
  } = await applicationContext
    .getUseCaseHelpers()
    .processUserAssociatedCases(openUserCases);

  for (const leadDocketNumber of leadDocketNumbersAssociatedWithUser) {
    const consolidatedCases = await applicationContext
      .getUseCaseHelpers()
      .getConsolidatedCasesForLeadCase({
        applicationContext,
        leadDocketNumber,
      });

    if (!casesAssociatedWithUserOrLeadCaseMap[leadDocketNumber]) {
      casesAssociatedWithUserOrLeadCaseMap[
        leadDocketNumber
      ] = applicationContext.getUseCaseHelpers().getUnassociatedLeadCase({
        casesAssociatedWithUserOrLeadCaseMap,
        consolidatedCases,
        leadDocketNumber,
      });
    }

    casesAssociatedWithUserOrLeadCaseMap[
      leadDocketNumber
    ].consolidatedCases = applicationContext
      .getUseCaseHelpers()
      .formatAndSortConsolidatedCases({
        consolidatedCases,
        leadDocketNumber,
        userAssociatedDocketNumbersMap,
      });
  }

  const foundCases = Object.values(casesAssociatedWithUserOrLeadCaseMap);

  return foundCases;
};
