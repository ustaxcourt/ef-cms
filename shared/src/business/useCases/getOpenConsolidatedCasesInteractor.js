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

  const {
    casesAssociatedWithUserOrLeadCaseMap,
    leadCaseIdsAssociatedWithUser,
    userAssociatedCaseIdsMap,
  } = applicationContext
    .getUseCaseHelpers()
    .processUserAssociatedCases(openUserCases);

  for (const leadCaseId of leadCaseIdsAssociatedWithUser) {
    casesAssociatedWithUserOrLeadCaseMap[
      leadCaseId
    ].consolidatedCases = await applicationContext
      .getUseCaseHelpers()
      .getConsolidatedCasesForLeadCase({
        applicationContext,
        casesAssociatedWithUserOrLeadCaseMap,
        leadCaseId,
        userAssociatedCaseIdsMap,
      });
  }

  const foundCases = Object.values(casesAssociatedWithUserOrLeadCaseMap);

  return foundCases;
};
