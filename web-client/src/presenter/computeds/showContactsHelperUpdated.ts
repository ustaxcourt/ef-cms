export const showContactsHelperUpdated = (
  partyType,
  PARTY_TYPES,
  filingType,
) => {
  const showContactPrimary = getShowContactPrimary(
    partyType,
    PARTY_TYPES,
    filingType,
  );

  const showContactSecondary = [
    PARTY_TYPES.petitionerDeceasedSpouse,
    PARTY_TYPES.petitionerSpouse,
  ].includes(partyType);

  return { showContactPrimary, showContactSecondary };
};

function getShowContactPrimary(partyType, PARTY_TYPES, filingType) {
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
    ].includes(partyType) || filingType === 'Myself and my spouse'
  );
}
