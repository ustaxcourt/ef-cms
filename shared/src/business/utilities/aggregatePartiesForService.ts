import { Case } from '../entities/cases/Case';
import { SERVICE_INDICATOR_TYPES } from '../entities/EntityConstants';
import { setServiceIndicatorsForCase } from './setServiceIndicatorsForCase';

export const aggregatePartiesForService = (
  rawCase: RawCase,
  options: { onlyProSePetitioners?: boolean } = { onlyProSePetitioners: false },
): {
  all: any[];
  paper: any[];
  electronic: Array<{ email: string; name: string }>;
} => {
  const formattedCase = setServiceIndicatorsForCase(rawCase);

  let allParties;

  if (options.onlyProSePetitioners) {
    allParties = formattedCase.petitioners.filter(
      petitioner =>
        !Case.isPetitionerRepresented(rawCase, petitioner.contactId),
    );
  } else {
    allParties = [
      ...formattedCase.petitioners,
      ...formattedCase.privatePractitioners,
      ...formattedCase.irsPractitioners,
    ];
  }

  const aggregated: {
    all: any[];
    paper: any[];
    electronic: Array<{ email: string; name: string }>;
  } = {
    all: [],
    electronic: [],
    paper: [],
  };

  allParties.forEach(party => {
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
