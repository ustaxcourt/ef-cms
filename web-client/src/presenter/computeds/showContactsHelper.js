export const showContactsHelper = (partyType, PARTY_TYPES) => {
  const contactPrimary = [
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
  ].includes(partyType);

  const contactSecondary = [
    PARTY_TYPES.petitionerDeceasedSpouse,
    PARTY_TYPES.petitionerSpouse,
  ].includes(partyType);

  return { contactPrimary, contactSecondary };
};
