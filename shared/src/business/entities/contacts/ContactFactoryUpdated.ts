import { BusinessContact } from './BusinessContact';
import { CONTACT_TYPES, FilingType, PARTY_TYPES } from '../EntityConstants';
import { ContactUpdated } from '@shared/business/entities/contacts/ContactUpdated';
import { DeceasedSpouseContact } from '@shared/business/entities/contacts/DeceasedSpouseContact';
import { OtherContact } from '@shared/business/entities/contacts/OtherContact';
import { SpouseContact } from '@shared/business/entities/contacts/SpouseContact';

export function ContactFactoryUpdated({
  contactInfoPrimary,
  contactInfoSecondary,
  filingType,
  hasSpouseConsent,
  partyType,
  petitionType,
}: {
  contactInfoPrimary: {};
  contactInfoSecondary: {};
  filingType: FilingType;
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
      primary: new BusinessContact(
        { ...contactInfoPrimary, contactType: CONTACT_TYPES.primary },
        petitionType,
        partyType,
      ),
      secondary: null,
    };
  }

  if (partyType === PARTY_TYPES.petitionerDeceasedSpouse) {
    return {
      primary: new ContactUpdated(
        { ...contactInfoPrimary, contactType: CONTACT_TYPES.primary },
        'PetitionerPrimaryContact',
        petitionType,
        partyType,
      ),
      secondary:
        contactInfoSecondary &&
        new DeceasedSpouseContact(
          { ...contactInfoSecondary, contactType: CONTACT_TYPES.secondary },
          petitionType,
          partyType,
        ),
    };
  }

  if (partyType === PARTY_TYPES.petitionerSpouse) {
    const shouldValidateSecondary =
      filingType === 'Petitioner and spouse' ||
      (filingType === 'Myself and my spouse' && !!hasSpouseConsent);
    return {
      primary: new ContactUpdated(
        { ...contactInfoPrimary, contactType: CONTACT_TYPES.primary },
        'PetitionerPrimaryContact',
        petitionType,
        partyType,
      ),
      secondary:
        contactInfoSecondary &&
        shouldValidateSecondary &&
        new SpouseContact(
          { ...contactInfoSecondary, contactType: CONTACT_TYPES.secondary },
          petitionType,
          partyType,
        ),
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
      { ...contactInfoPrimary, contactType: CONTACT_TYPES.primary },
      'PetitionerPrimaryContact',
      petitionType,
      partyType,
    ),
    secondary: null,
  };
}
