import { BusinessContact } from './BusinessContact';
import { CONTACT_TYPES, PARTY_TYPES } from '../EntityConstants';
import { ContactUpdated } from '@shared/business/entities/contacts/ContactUpdated';
import { DeceasedSpouseContact } from '@shared/business/entities/contacts/DeceasedSpouseContact';
import { SpouseContact } from '@shared/business/entities/contacts/SpouseContact';
// import { NextFriendForIncompetentPersonContact } from './NextFriendForIncompetentPersonContact';
// import { NextFriendForMinorContact } from './NextFriendForMinorContact';
// import { PartnershipAsTaxMattersPartnerPrimaryContact } from './PartnershipAsTaxMattersPartnerContact';
// import { PartnershipBBAPrimaryContact } from './PartnershipBBAContact';
// import { PartnershipOtherThanTaxMattersPrimaryContact } from './PartnershipOtherThanTaxMattersContact';
// import { PetitionerConservatorContact } from './PetitionerConservatorContact';
// import { PetitionerCorporationContact } from './PetitionerCorporationContact';
// import { PetitionerCustodianContact } from './PetitionerCustodianContact';
// import { PetitionerDeceasedSpouseContact } from './PetitionerDeceasedSpouseContact';
// import { PetitionerEstateWithExecutorPrimaryContact } from './PetitionerEstateWithExecutorPrimaryContact';
// import { PetitionerGuardianContact } from './PetitionerGuardianContact';
// import { PetitionerIntermediaryContact } from './PetitionerIntermediaryContact';
// import { PetitionerPrimaryContact } from './PetitionerPrimaryContact';
// import { PetitionerSpouseContact } from './PetitionerSpouseContact';
// import { PetitionerTrustContact } from './PetitionerTrustContact';
// import { SurvivingSpouseContact } from './SurvivingSpouseContact';

export function ContactFactoryUpdated({
  contactInfo,
  hasSpouseConsent,
  partyType,
  petitionType,
}: {
  contactInfo: {};
  partyType: string;
  petitionType: string;
  hasSpouseConsent: boolean;
}) {
  if (!contactInfo) {
    return { primary: null, secondary: null };
  }
  if (
    [
      PARTY_TYPES.corporation,
      PARTY_TYPES.partnershipBBA,
      PARTY_TYPES.partnershipOtherThanTaxMatters,
      PARTY_TYPES.partnershipAsTaxMattersPartner,
    ].includes(partyType)
  ) {
    return {
      primary: new BusinessContact(contactInfo, petitionType, partyType),
      secondary: null,
    };
  }

  if (partyType === PARTY_TYPES.petitionerDeceasedSpouse) {
    return {
      primary: new ContactUpdated(
        contactInfo,
        CONTACT_TYPES.primary,
        petitionType,
        partyType,
      ),
      secondary: new DeceasedSpouseContact(
        contactInfo,
        petitionType,
        partyType,
      ),
    };
    // {
    //   primary: new PetitionerPrimaryContact(
    //     { ...contactInfo.primary, contactType: CONTACT_TYPES.primary },
    //     { applicationContext },
    //   ),
    //   secondary: new PetitionerDeceasedSpouseContact(
    //     { ...contactInfo.secondary, contactType: CONTACT_TYPES.secondary },
    //     { applicationContext },
    //   ),
    // };
  }

  if (PARTY_TYPES.petitionerSpouse) {
    const shouldValidateSecondary = !!hasSpouseConsent;
    return {
      primary: new ContactUpdated(
        contactInfo,
        CONTACT_TYPES.primary,
        petitionType,
        partyType,
      ),
      secondary:
        shouldValidateSecondary &&
        new SpouseContact(contactInfo, petitionType, partyType),
    };
  }

  return {
    primary: new ContactUpdated(
      contactInfo,
      CONTACT_TYPES.primary,
      petitionType,
      partyType,
    ),
    secondary: null,
  };
  // primary: new PetitionerPrimaryContact(
  //   { ...contactInfo.primary, contactType: CONTACT_TYPES.primary },
  //   { applicationContext },
  // ),

  // switch (partyType) {
  //   case PARTY_TYPES.donor:
  //   case PARTY_TYPES.transferee:
  //   case PARTY_TYPES.petitioner:
  //     return {
  //       primary: new PetitionerPrimaryContact(
  //         { ...contactInfo.primary, contactType: CONTACT_TYPES.primary },
  //         { applicationContext },
  //       ),
  //       secondary: null,
  //     };
  //   case PARTY_TYPES.conservator:
  //     return {
  //       primary: new PetitionerConservatorContact(
  //         { ...contactInfo.primary, contactType: CONTACT_TYPES.primary },
  //         { applicationContext },
  //       ),
  //     };
  //   case PARTY_TYPES.corporation:
  //     return {
  //       primary: new PetitionerCorporationContact(
  //         { ...contactInfo.primary, contactType: CONTACT_TYPES.primary },
  //         { applicationContext },
  //       ),
  //       secondary: null,
  //     };
  //   case PARTY_TYPES.custodian:
  //     return {
  //       primary: new PetitionerCustodianContact(
  //         { ...contactInfo.primary, contactType: CONTACT_TYPES.primary },
  //         { applicationContext },
  //       ),
  //       secondary: null,
  //     };
  //   case PARTY_TYPES.estate:
  //     return {
  //       primary: new PetitionerEstateWithExecutorPrimaryContact(
  //         { ...contactInfo.primary, contactType: CONTACT_TYPES.primary },
  //         { applicationContext },
  //       ),
  //       secondary: null,
  //     };
  //   case PARTY_TYPES.estateWithoutExecutor:
  //     return {
  //       primary: new PetitionerIntermediaryContact(
  //         { ...contactInfo.primary, contactType: CONTACT_TYPES.primary },
  //         { applicationContext },
  //       ),
  //       secondary: null,
  //     };
  //   case PARTY_TYPES.guardian:
  //     return {
  //       primary: new PetitionerGuardianContact(
  //         { ...contactInfo.primary, contactType: CONTACT_TYPES.primary },
  //         { applicationContext },
  //       ),
  //       secondary: null,
  //     };
  //   case PARTY_TYPES.nextFriendForIncompetentPerson:
  //     return {
  //       primary: new NextFriendForIncompetentPersonContact(
  //         { ...contactInfo.primary, contactType: CONTACT_TYPES.primary },
  //         { applicationContext },
  //       ),
  //       secondary: null,
  //     };
  //   case PARTY_TYPES.nextFriendForMinor:
  //     return {
  //       primary: new NextFriendForMinorContact(
  //         { ...contactInfo.primary, contactType: CONTACT_TYPES.primary },
  //         { applicationContext },
  //       ),
  //       secondary: null,
  //     };
  //   case PARTY_TYPES.partnershipAsTaxMattersPartner:
  //     return {
  //       primary: new PartnershipAsTaxMattersPartnerPrimaryContact(
  //         { ...contactInfo.primary, contactType: CONTACT_TYPES.primary },
  //         { applicationContext },
  //       ),
  //       secondary: null,
  //     };
  //   case PARTY_TYPES.partnershipBBA:
  //     return {
  //       primary: new PartnershipBBAPrimaryContact(
  //         { ...contactInfo.primary, contactType: CONTACT_TYPES.primary },
  //         { applicationContext },
  //       ),
  //       secondary: null,
  //     };
  //   case PARTY_TYPES.partnershipOtherThanTaxMatters:
  //     return {
  //       primary: new PartnershipOtherThanTaxMattersPrimaryContact(
  //         { ...contactInfo.primary, contactType: CONTACT_TYPES.primary },
  //         { applicationContext },
  //       ),
  //       secondary: null,
  //     };
  //   case PARTY_TYPES.petitionerDeceasedSpouse:
  //     return {
  //       primary: new PetitionerPrimaryContact(
  //         { ...contactInfo.primary, contactType: CONTACT_TYPES.primary },
  //         { applicationContext },
  //       ),
  //       secondary: new PetitionerDeceasedSpouseContact(
  //         { ...contactInfo.secondary, contactType: CONTACT_TYPES.secondary },
  //         { applicationContext },
  //       ),
  //     };
  //   case PARTY_TYPES.petitionerSpouse:
  //     return {
  //       primary: new PetitionerPrimaryContact(
  //         { ...contactInfo.primary, contactType: CONTACT_TYPES.primary },
  //         { applicationContext },
  //       ),
  //       secondary: new PetitionerSpouseContact(
  //         { ...contactInfo.secondary, contactType: CONTACT_TYPES.secondary },
  //         { applicationContext },
  //       ),
  //     };
  //   case PARTY_TYPES.survivingSpouse:
  //     return {
  //       primary: new SurvivingSpouseContact(
  //         { ...contactInfo.primary, contactType: CONTACT_TYPES.primary },
  //         { applicationContext },
  //       ),
  //       secondary: null,
  //     };
  //   case PARTY_TYPES.trust:
  //     return {
  //       primary: new PetitionerTrustContact(
  //         { ...contactInfo.primary, contactType: CONTACT_TYPES.primary },
  //         { applicationContext },
  //       ),
  //       secondary: null,
  //     };
  //   default:
  //     if (partyType) {
  //       throw new Error(`Unrecognized party type "${partyType}"`);
  //     }
  //     return {
  //       primary: {},
  //       secondary: null,
  //     };
  // }
}
