import { Case } from '../entities/cases/Case';
import { SERVICE_INDICATOR_TYPES } from '../entities/EntityConstants';
import { RawPetitioner } from '../entities/contacts/Petitioner';
import { RawIrsPractitioner } from '../entities/IrsPractitioner';
import { RawPrivatePractitioner } from '../entities/PrivatePractitioner';
import { UserContact } from '../entities/User';
import { setServiceIndicatorsForPetitionersOnCase } from '@shared/business/utilities/setServiceIndicatorsForPetitionersOnCase';

type PrivatePractitionerPaperParty = Omit<RawPrivatePractitioner, 'contact'> &
  Partial<UserContact>;

type IrsPractitionerPaperParty = Omit<RawIrsPractitioner, 'contact'> &
  Partial<UserContact>;

export type AggregatedPaperServiceParty =
  | RawPetitioner
  | PrivatePractitionerPaperParty
  | IrsPractitionerPaperParty;

type CasePartyEligibleForPaperOrElectronicMerge =
  | RawPetitioner
  | RawPrivatePractitioner
  | RawIrsPractitioner;

export type ElectronicServiceRecipient = {
  email: string;
  name: string;
};

export type ServedPartiesAggregation = {
  all: Array<ElectronicServiceRecipient | AggregatedPaperServiceParty>;
  paper: AggregatedPaperServiceParty[];
  electronic: ElectronicServiceRecipient[];
};

const mergePaperPartyForService = (
  party: CasePartyEligibleForPaperOrElectronicMerge,
): AggregatedPaperServiceParty => {
  return {
    ...party,
    ...('contact' in party && party.contact ? party.contact : {}),
  } as AggregatedPaperServiceParty;
};

export const aggregatePartiesForService = (
  rawCase: RawCase,
  options: { onlyProSePetitioners?: boolean } = { onlyProSePetitioners: false },
): ServedPartiesAggregation => {
  const formattedCase = setServiceIndicatorsForPetitionersOnCase(rawCase);

  let allParties: CasePartyEligibleForPaperOrElectronicMerge[];

  if (options.onlyProSePetitioners) {
    allParties = formattedCase.petitioners.filter(
      petitioner =>
        !Case.isPetitionerRepresented(rawCase, petitioner.contactId),
    ) as CasePartyEligibleForPaperOrElectronicMerge[];
  } else {
    allParties = [
      ...(formattedCase.petitioners ?? []),
      ...(formattedCase.privatePractitioners ?? []),
      ...(formattedCase.irsPractitioners ?? []),
    ] as CasePartyEligibleForPaperOrElectronicMerge[];
  }

  const aggregated: ServedPartiesAggregation = {
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
      aggregated.paper.push(mergePaperPartyForService(party));
    }
  });

  aggregated.all = Array.prototype.concat(
    aggregated.electronic,
    aggregated.paper,
  );

  return aggregated;
};
