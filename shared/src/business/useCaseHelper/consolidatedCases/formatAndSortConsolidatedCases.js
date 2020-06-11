const { Case } = require('../../entities/cases/Case');

/**
 * Formats and sorts consolidated cases
 *
 * @param {object} arguments.consolidatedCases list of consolidated cases
 * @param {object} arguments.leadCaseId the leadCaseId
 * @param {object} arguments.userAssociatedCaseIdsMap the list of caseIds the user is associated with
 * @returns {object} consolidated cases sorted by docket number
 */
exports.formatAndSortConsolidatedCases = ({
  consolidatedCases,
  leadCaseId,
  userAssociatedCaseIdsMap,
}) => {
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
