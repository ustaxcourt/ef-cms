import { SERVICE_INDICATOR_TYPES } from '../entities/EntityConstants';
import { setServiceIndicatorsForCase } from './setServiceIndicatorsForCase';

/**
 * aggregatePartiesForService
 * @param {object} caseEntity the case entity with parties to be served
 * @returns {object} the aggregated contact information for all parties,
 * electronically-served parties, and paper-served parties
 */
export const aggregatePartiesForService = caseEntity => {
  const formattedCase = setServiceIndicatorsForCase(caseEntity);
  const parties = [
    ...formattedCase.petitioners,
    ...formattedCase.privatePractitioners,
    ...formattedCase.irsPractitioners,
  ];

  const aggregated = {
    all: [],
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
