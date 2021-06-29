const {
  setServiceIndicatorsForCase,
} = require('./setServiceIndicatorsForCase');
const { SERVICE_INDICATOR_TYPES } = require('../entities/EntityConstants');

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
    ...formattedCase.petitioners,
    ...formattedCase.privatePractitioners,
    ...formattedCase.irsPractitioners,
  ];

  const aggregated = {
    electronic: [],
    paper: [],
  };

  parties.forEach(party => {
    if (
      party &&
      party.email &&
      party.serviceIndicator === SERVICE_INDICATOR_TYPES.SI_ELECTRONIC
    ) {
      aggregated.electronic.push({
        email: party.email,
        name: party.name,
      });
    } else if (
      party &&
      party.serviceIndicator === SERVICE_INDICATOR_TYPES.SI_PAPER
    ) {
      aggregated.paper.push({
        ...party,
        ...(party.contact || {}),
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
