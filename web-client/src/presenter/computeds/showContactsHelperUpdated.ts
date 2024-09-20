import {
  FilingType,
  PARTY_TYPES,
  PartyType,
} from '@shared/business/entities/EntityConstants';

export const showContactsHelperUpdated = ({
  filingType,
  isSpouseDeceased,
  partyType,
}: {
  filingType: FilingType;
  isSpouseDeceased: boolean;
  partyType: PartyType;
}) => {
  const showContactPrimary = getShowContactPrimary(partyType, filingType);

  const showContactSecondary = getShowContactSecondary({
    filingType,
    isSpouseDeceased,
    partyType,
  });
  return { showContactPrimary, showContactSecondary };
};

function getShowContactPrimary(partyType, filingType) {
  return (
    [
      PARTY_TYPES.conservator,
      PARTY_TYPES.corporation,
      PARTY_TYPES.custodian,
      PARTY_TYPES.donor,
      PARTY_TYPES.estate,
      PARTY_TYPES.estateWithoutExecutor,
      PARTY_TYPES.guardian,
      PARTY_TYPES.nextFriendForIncompetentPerson,
      PARTY_TYPES.nextFriendForMinor,
      PARTY_TYPES.partnershipAsTaxMattersPartner,
      PARTY_TYPES.partnershipBBA,
      PARTY_TYPES.partnershipOtherThanTaxMatters,
      PARTY_TYPES.petitioner,
      PARTY_TYPES.petitionerDeceasedSpouse,
      PARTY_TYPES.petitionerSpouse,
      PARTY_TYPES.survivingSpouse,
      PARTY_TYPES.transferee,
      PARTY_TYPES.trust,
    ].includes(partyType) ||
    filingType === 'Myself and my spouse' ||
    filingType === 'Myself'
  );
}

function getShowContactSecondary({
  filingType,
  isSpouseDeceased,
  partyType,
}: {
  filingType: FilingType;
  isSpouseDeceased: boolean;
  partyType: PartyType;
}): boolean {
  const isContactSecondaryPartyType =
    PARTY_TYPES.petitionerDeceasedSpouse === partyType ||
    PARTY_TYPES.petitionerSpouse === partyType;

  if (!isContactSecondaryPartyType) return false;

  if (filingType === 'Myself and my spouse' && !isSpouseDeceased) {
    return false;
  }

  return true;
}
