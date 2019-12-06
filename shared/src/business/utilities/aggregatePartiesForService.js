const {
  constants,
  setServiceIndicatorsForCase,
} = require('./setServiceIndicatorsForCase');

/**
 * aggregatePartiesForService
 *
 * @param {object} caseEntity the case entity with parties to be served
 * @returns {object} the aggregated contact information for all parties,
 * electronically-served parties, and paper-served parties
 */

const aggregatePartiesForService = caseEntity => {
  const formattedCase = setServiceIndicatorsForCase(caseEntity);

  const parties = [
    formattedCase.contactPrimary,
    formattedCase.contactSecondary,
    ...formattedCase.practitioners,
    ...formattedCase.respondents,
  ];

  const aggregated = { electronic: [], paper: [] };
  parties.forEach(party => {
    if (
      party &&
      party.email &&
      party.serviceIndicator === constants.SI_ELECTRONIC
    ) {
      aggregated.electronic.push({
        email: party.email,
        name: party.name,
      });
    } else if (party && party.serviceIndicator === constants.SI_PAPER) {
      aggregated.paper.push({
        name: party.name,
      });
    }
  });
  aggregated.all = Array.prototype.concat(
    aggregated.electronic,
    aggregated.paper,
  );
  return aggregated;
};

module.exports = { aggregatePartiesForService };
