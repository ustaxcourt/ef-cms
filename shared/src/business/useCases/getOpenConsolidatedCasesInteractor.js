const { UserCase } = require('../entities/UserCase');

/**
 * getOpenConsolidatedCasesInteractor
 *
 * @param {object} applicationContext the application context
 * @returns {object} the open cases data
 */
exports.getOpenConsolidatedCasesInteractor = async applicationContext => {
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
  } = applicationContext
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
      casesAssociatedWithUserOrLeadCaseMap[leadDocketNumber] =
        applicationContext.getUseCaseHelpers().getUnassociatedLeadCase({
          casesAssociatedWithUserOrLeadCaseMap,
          consolidatedCases,
          leadDocketNumber,
        });
    }

    casesAssociatedWithUserOrLeadCaseMap[leadDocketNumber].consolidatedCases =
      applicationContext.getUseCaseHelpers().formatAndSortConsolidatedCases({
        consolidatedCases,
        leadDocketNumber,
        userAssociatedDocketNumbersMap,
      });
  }

  const foundCases = Object.values(casesAssociatedWithUserOrLeadCaseMap);

  return foundCases.map(c => {
    // explicitly unset the entityName because this is returning a composite entity and if an entityName
    // is set, the genericHandler will send it through the entity constructor for that entity and strip
    // out necessary data
    c.entityName = undefined;
    return c;
  });
};
