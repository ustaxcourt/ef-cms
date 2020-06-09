const {
  getConsolidatedCasesForLeadCase,
} = require('../useCaseHelper/consolidatedCases/getConsolidatedCasesForLeadCase');
const {
  processUserAssociatedCases,
} = require('../useCaseHelper/consolidatedCases/processUserAssociatedCases');
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
    .getOpenCasesByUser({ applicationContext, userId });

  openUserCases = UserCase.validateRawCollection(openUserCases, {
    applicationContext,
  });

  if (!openUserCases.length) {
    return [];
  }

  const {
    casesAssociatedWithUserOrLeadCaseMap,
    leadCaseIdsAssociatedWithUser,
    userAssociatedCaseIdsMap,
  } = processUserAssociatedCases(openUserCases);

  for (const leadCaseId of leadCaseIdsAssociatedWithUser) {
    casesAssociatedWithUserOrLeadCaseMap[
      leadCaseId
    ].consolidatedCases = await getConsolidatedCasesForLeadCase({
      applicationContext,
      casesAssociatedWithUserOrLeadCaseMap,
      leadCaseId,
      userAssociatedCaseIdsMap,
    });
  }

  const foundCases = Object.values(casesAssociatedWithUserOrLeadCaseMap);

  return foundCases;
};
