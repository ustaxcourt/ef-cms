const { CASE_STATUS_TYPES } = require('../entities/EntityConstants');
const { compareISODateStrings } = require('../utilities/sortFunctions');
const { UserCase } = require('../entities/UserCase');

/**
 * getCasesForUserInteractor
 *
 * @param {object} applicationContext the application context
 * @returns {object} the open cases data
 */
exports.getCasesForUserInteractor = async applicationContext => {
  const { userId } = await applicationContext.getCurrentUser();

  let allUserCases = await applicationContext
    .getPersistenceGateway()
    .getCasesForUser({
      applicationContext,
      userId,
    });

  allUserCases = UserCase.validateRawCollection(allUserCases, {
    applicationContext,
  });

  const sortedClosedCases = allUserCases
    .filter(({ status }) => status === CASE_STATUS_TYPES.closed)
    .sort((a, b) => compareISODateStrings(a.closedDate, b.closedDate))
    .reverse();

  let filteredOpenCases = allUserCases.filter(
    ({ status }) => status !== CASE_STATUS_TYPES.closed,
  );

  let {
    casesAssociatedWithUserOrLeadCaseMap,
    leadDocketNumbersAssociatedWithUser,
    userAssociatedDocketNumbersMap,
  } = applicationContext
    .getUseCaseHelpers()
    .processUserAssociatedCases(filteredOpenCases);

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

  const foundOpenCases = Object.values(
    casesAssociatedWithUserOrLeadCaseMap,
  ).map(c => {
    // explicitly unset the entityName because this is returning a composite entity and if an entityName
    // is set, the genericHandler will send it through the entity constructor for that entity and strip
    // out necessary data
    c.entityName = undefined;
    return c;
  });

  return { closedCaseList: sortedClosedCases, openCaseList: foundOpenCases };
};
