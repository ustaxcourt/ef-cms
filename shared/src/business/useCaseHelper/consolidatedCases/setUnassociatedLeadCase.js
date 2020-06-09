/**
 * Finds a lead case when it is not associated with the current user
 *
 * @param {object} arguments.casesAssociatedWithUserOrLeadCaseMap an object containing cases associated with the current user
 * @param {object} arguments.consolidatedCases the list of consolidated cases
 * @param {object} arguments.leadCaseId the leadCaseId
 * @returns {object} casesAssociatedWithUserOrLeadCaseMap an object containing cases associated with the current user
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
