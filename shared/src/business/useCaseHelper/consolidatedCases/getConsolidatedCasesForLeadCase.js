const { Case } = require('../../entities/cases/Case');
const { setUnassociatedLeadCase } = require('./setUnassociatedLeadCase');

/**
 * TODO
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {object} the open cases data
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
    setUnassociatedLeadCase({
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
