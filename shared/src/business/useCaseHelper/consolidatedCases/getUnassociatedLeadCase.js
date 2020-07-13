/**
 * Finds a lead case when it is not associated with the current user
 *
 * @param {object} arguments.consolidatedCases the list of consolidated cases
 * @param {object} arguments.leadCaseId the leadCaseId
 * @returns {object} the lead case
 */
exports.getUnassociatedLeadCase = ({ consolidatedCases, leadCaseId }) => {
  const leadCase = consolidatedCases.find(
    consolidatedCase => consolidatedCase.caseId === leadCaseId,
  );
  leadCase.isRequestingUserAssociated = false;

  return leadCase;
};
