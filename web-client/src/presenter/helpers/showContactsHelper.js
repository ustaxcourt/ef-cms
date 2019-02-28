import { PARTY_TYPES } from '../../../../shared/src/business/entities/Contacts/PetitionContact';

export const showContactsHelper = partyType => {
  const contactPrimary =
    partyType === PARTY_TYPES.petitioner ||
    partyType === PARTY_TYPES.petitionerSpouse ||
    partyType === PARTY_TYPES.petitionerDeceasedSpouse ||
    partyType === PARTY_TYPES.estate ||
    partyType === PARTY_TYPES.estateWithoutExecutor ||
    partyType === PARTY_TYPES.trust ||
    partyType === PARTY_TYPES.corporation ||
    partyType === PARTY_TYPES.partnershipAsTaxMattersPartner ||
    partyType === PARTY_TYPES.partnershipOtherThanTaxMatters ||
    partyType === PARTY_TYPES.partnershipBBA ||
    partyType === PARTY_TYPES.conservator ||
    partyType === PARTY_TYPES.guardian ||
    partyType === PARTY_TYPES.custodian ||
    partyType === PARTY_TYPES.nextFriendForMinor ||
    partyType === PARTY_TYPES.nextFriendForIncompetentPerson ||
    partyType === PARTY_TYPES.donor ||
    partyType === PARTY_TYPES.transferee ||
    partyType === PARTY_TYPES.survivingSpouse;

  const contactSecondary =
    partyType === PARTY_TYPES.petitionerSpouse ||
    partyType === PARTY_TYPES.petitionerDeceasedSpouse ||
    partyType === PARTY_TYPES.estate ||
    partyType === PARTY_TYPES.trust ||
    partyType === PARTY_TYPES.partnershipAsTaxMattersPartner ||
    partyType === PARTY_TYPES.partnershipOtherThanTaxMatters ||
    partyType === PARTY_TYPES.partnershipBBA ||
    partyType === PARTY_TYPES.conservator ||
    partyType === PARTY_TYPES.guardian ||
    partyType === PARTY_TYPES.custodian ||
    partyType === PARTY_TYPES.nextFriendForMinor ||
    partyType === PARTY_TYPES.nextFriendForIncompetentPerson ||
    partyType === PARTY_TYPES.survivingSpouse;

  return { contactPrimary, contactSecondary };
};
