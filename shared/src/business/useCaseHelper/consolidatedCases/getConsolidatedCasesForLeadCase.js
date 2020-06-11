const { Case } = require('../../entities/cases/Case');

/**
 * Retrieves all cases associated with the provided leadCaseId.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.casesAssociatedWithUserOrLeadCaseMap an map where each
 *  key is a caseId and the associated value is a case record
 * @param {object} providers.leadCaseId the leadCaseId
 * @param {object} providers.userAssociatedCaseIdsMap an object where each key is a caseId
 *  and the value is a boolean representing whether or not the current use is associated with that case
 * @returns {object} a list of all cases associated with the leadCaseId, sorted by docket number
 */
exports.getConsolidatedCasesForLeadCase = async ({
  applicationContext,
  casesAssociatedWithUserOrLeadCaseMap,
  leadCaseId,
  userAssociatedCaseIdsMap,
}) => {
  let consolidatedCases = await applicationContext
    .getPersistenceGateway()
    .getCasesByLeadCaseId({
      applicationContext,
      leadCaseId,
    });

  consolidatedCases = Case.validateRawCollection(consolidatedCases, {
    applicationContext,
    filtered: true,
  });

  if (!casesAssociatedWithUserOrLeadCaseMap[leadCaseId]) {
    casesAssociatedWithUserOrLeadCaseMap = applicationContext
      .getUseCaseHelpers()
      .setUnassociatedLeadCase({
        casesAssociatedWithUserOrLeadCaseMap,
        consolidatedCases,
        leadCaseId,
      });
  }

  const caseConsolidatedCases = [];
  consolidatedCases.forEach(consolidatedCase => {
    consolidatedCase.isRequestingUserAssociated = !!userAssociatedCaseIdsMap[
      consolidatedCase.caseId
    ];

    if (consolidatedCase.caseId !== leadCaseId) {
      caseConsolidatedCases.push(consolidatedCase);
    }
  });

  return Case.sortByDocketNumber(caseConsolidatedCases);
};
