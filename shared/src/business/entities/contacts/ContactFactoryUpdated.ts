import { BusinessContact } from './BusinessContact';
import { CONTACT_TYPES, PARTY_TYPES } from '../EntityConstants';
import { ContactUpdated } from '@shared/business/entities/contacts/ContactUpdated';
import { DeceasedSpouseContact } from '@shared/business/entities/contacts/DeceasedSpouseContact';
import { OtherContact } from '@shared/business/entities/contacts/OtherContact';
import { SpouseContact } from '@shared/business/entities/contacts/SpouseContact';

export function ContactFactoryUpdated({
  contactInfoPrimary,
  contactInfoSecondary,
  hasSpouseConsent,
  partyType,
  petitionType,
}: {
  contactInfoPrimary: {};
  contactInfoSecondary: {};
  partyType: string;
  petitionType: string;
  hasSpouseConsent: boolean;
}) {
  if (!contactInfoPrimary) {
    return { primary: null, secondary: null };
  }
  if (
    (
      [
        PARTY_TYPES.corporation,
        PARTY_TYPES.partnershipBBA,
        PARTY_TYPES.partnershipOtherThanTaxMatters,
        PARTY_TYPES.partnershipAsTaxMattersPartner,
      ] as string[]
    ).includes(partyType)
  ) {
    return {
      primary: new BusinessContact(contactInfoPrimary, petitionType, partyType),
      secondary: null,
    };
  }

  if (partyType === PARTY_TYPES.petitionerDeceasedSpouse) {
    return {
      primary: new ContactUpdated(
        contactInfoPrimary,
        CONTACT_TYPES.primary,
        petitionType,
        partyType,
      ),
      secondary:
        contactInfoSecondary &&
        new DeceasedSpouseContact(
          contactInfoSecondary,
          petitionType,
          partyType,
        ),
    };
  }

  if (partyType === PARTY_TYPES.petitionerSpouse) {
    const shouldValidateSecondary = !!hasSpouseConsent;
    return {
      primary: new ContactUpdated(
        contactInfoPrimary,
        CONTACT_TYPES.primary,
        petitionType,
        partyType,
      ),
      secondary:
        contactInfoSecondary &&
        shouldValidateSecondary &&
        new SpouseContact(contactInfoSecondary, petitionType, partyType),
    };
  }

  if (
    (
      [
        PARTY_TYPES.estate,
        PARTY_TYPES.estateWithoutExecutor,
        PARTY_TYPES.trust,
        PARTY_TYPES.conservator,
        PARTY_TYPES.guardian,
        PARTY_TYPES.custodian,
        PARTY_TYPES.nextFriendForMinor,
        PARTY_TYPES.nextFriendForIncompetentPerson,
        PARTY_TYPES.survivingSpouse,
      ] as string[]
    ).includes(partyType)
  ) {
    return {
      primary: new OtherContact(contactInfoPrimary, petitionType, partyType),
      secondary: null,
    };
  }
  return {
    primary: new ContactUpdated(
      contactInfoPrimary,
      CONTACT_TYPES.primary,
      petitionType,
      partyType,
    ),
    secondary: null,
  };
}
