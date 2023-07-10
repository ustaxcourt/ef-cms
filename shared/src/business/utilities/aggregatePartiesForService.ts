import {
  Case,
  isUserIdRepresentedByPrivatePractitioner,
} from '../entities/cases/Case';
import { SERVICE_INDICATOR_TYPES } from '../entities/EntityConstants';
import { setServiceIndicatorsForCase } from './setServiceIndicatorsForCase';

export const aggregatePartiesForService = (
  rawCase: Case,
  options?: { onlyProSePetitioners: boolean },
) => {
  const formattedCase = setServiceIndicatorsForCase(rawCase);
  const parties = [
    ...formattedCase.petitioners,
    ...(options?.onlyProSePetitioners
      ? []
      : formattedCase.privatePractitioners),
    ...(options?.onlyProSePetitioners ? [] : formattedCase.irsPractitioners),
  ];

  const aggregated = {
    all: [],
    electronic: [],
    paper: [],
  };

  parties.forEach(party => {
    if (
      options?.onlyProSePetitioners &&
      isUserIdRepresentedByPrivatePractitioner(rawCase, party.contactId)
    ) {
      return;
    }
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
