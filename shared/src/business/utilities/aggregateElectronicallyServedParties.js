const {
  constants,
  setServiceIndicatorsForCase,
} = require('./setServiceIndicatorsForCase');

/**
 * aggregateElectronicallyServedParties
 *
 * @param {object} caseEntity the case entity with parties to be served
 * @returns {Array} the aggregated contact information for all parties
 */

const aggregateElectronicallyServedParties = caseEntity => {
  const formattedCase = setServiceIndicatorsForCase(caseEntity);

  const parties = [
    formattedCase.contactPrimary,
    formattedCase.contactSecondary,
    ...formattedCase.practitioners,
    ...formattedCase.respondents,
  ];

  const aggregated = [];
  parties.forEach(party => {
    if (
      party &&
      party.email &&
      party.serviceIndicator === constants.SI_ELECTRONIC
    ) {
      aggregated.push({
        email: party.email,
        name: party.name,
      });
    }
  });
  return aggregated;
};

module.exports = { aggregateElectronicallyServedParties };
