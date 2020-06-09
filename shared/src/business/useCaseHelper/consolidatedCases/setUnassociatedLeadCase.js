/**
 * TODO
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {object} the open cases data
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
};
