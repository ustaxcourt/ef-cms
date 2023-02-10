/**
 * Finds a lead case when it is not associated with the current user
 *
 * @param {object} arguments.consolidatedCases the list of consolidated cases
 * @param {object} arguments.leadDocketNumber the leadDocketNumber
 * @returns {object} the lead case
 */
exports.getAssociatedLeadCase = ({ consolidatedCases, leadDocketNumber }) => {
  const leadCase = consolidatedCases.find(
    consolidatedCase => consolidatedCase.docketNumber === leadDocketNumber,
  );
  leadCase.isRequestingUserAssociated = true;

  return leadCase;
};
