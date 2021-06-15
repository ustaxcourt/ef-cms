const { Case } = require('../../entities/cases/Case');

/**
 * Formats and sorts consolidated cases
 *
 * @param {object} arguments.consolidatedCases list of consolidated cases
 * @param {object} arguments.leadDocketNumber the leadDocketNumber
 * @param {object} arguments.userAssociatedDocketNumbersMap the list of docketNumbers the user is associated with
 * @returns {object} consolidated cases sorted by docket number
 */
exports.formatAndSortConsolidatedCases = ({
  consolidatedCases,
  leadDocketNumber,
  userAssociatedDocketNumbersMap,
}) => {
  const caseConsolidatedCases = [];
  consolidatedCases.forEach(consolidatedCase => {
    consolidatedCase.isRequestingUserAssociated =
      !!userAssociatedDocketNumbersMap[consolidatedCase.docketNumber];

    if (consolidatedCase.docketNumber !== leadDocketNumber) {
      caseConsolidatedCases.push(consolidatedCase);
    }
  });

  return Case.sortByDocketNumber(caseConsolidatedCases);
};
