/**
 * Finds a lead case when it is not associated with the current user
 *
 * @param {object} providers the providers object
 * @param {object} providers.casesAssociatedWithUserOrLeadCaseMap an object containing cases associated with the current user
 * @param {object} providers.consolidatedCases the list of consolidated cases
 * @param {object} providers.leadCaseId the leadCaseId
 * @returns casesAssociatedWithUserOrLeadCaseMap an object containing cases associated with the current user
 */
exports.setUnassociatedLeadCase = ({
  casesAssociatedWithUserOrLeadCaseMap,
  consolidatedCases,
  leadCaseId,
}) => {
  const leadCase = consolidatedCases.find(
    consolidatedCase => consolidatedCase.caseId === leadCaseId,
  );

  leadCase.isRequestingUserAssociated = false;
  casesAssociatedWithUserOrLeadCaseMap[leadCaseId] = leadCase;

  return casesAssociatedWithUserOrLeadCaseMap;
};
