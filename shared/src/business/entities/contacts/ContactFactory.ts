import { CONTACT_TYPES, PARTY_TYPES, PartyType } from '../EntityConstants';
import { NextFriendForIncompetentPersonContact } from './NextFriendForIncompetentPersonContact';
import { NextFriendForMinorContact } from './NextFriendForMinorContact';
import { PartnershipAsTaxMattersPartnerPrimaryContact } from './PartnershipAsTaxMattersPartnerContact';
import { PartnershipBBAPrimaryContact } from './PartnershipBBAContact';
import { PartnershipOtherThanTaxMattersPrimaryContact } from './PartnershipOtherThanTaxMattersContact';
import { PetitionerConservatorContact } from './PetitionerConservatorContact';
import { PetitionerCorporationContact } from './PetitionerCorporationContact';
import { PetitionerCustodianContact } from './PetitionerCustodianContact';
import { PetitionerDeceasedSpouseContact } from './PetitionerDeceasedSpouseContact';
import { PetitionerEstateWithExecutorPrimaryContact } from './PetitionerEstateWithExecutorPrimaryContact';
import { PetitionerGuardianContact } from './PetitionerGuardianContact';
import { PetitionerIntermediaryContact } from './PetitionerIntermediaryContact';
import { PetitionerPrimaryContact } from './PetitionerPrimaryContact';
import { PetitionerSpouseContact } from './PetitionerSpouseContact';
import { PetitionerTrustContact } from './PetitionerTrustContact';
import { SurvivingSpouseContact } from './SurvivingSpouseContact';

export function ContactFactory({
  applicationContext,
  contactInfo,
  partyType,
}: {
  applicationContext: IApplicationContext;
  contactInfo: any;
  partyType: PartyType;
}) {
  switch (partyType) {
    case PARTY_TYPES.donor:
    case PARTY_TYPES.transferee:
    case PARTY_TYPES.petitioner:
      return {
        primary: new PetitionerPrimaryContact(
          { ...contactInfo.primary, contactType: CONTACT_TYPES.primary },
          { applicationContext },
        ),
        secondary: null,
      };
    case PARTY_TYPES.conservator:
      return {
        primary: new PetitionerConservatorContact(
          { ...contactInfo.primary, contactType: CONTACT_TYPES.primary },
          { applicationContext },
        ),
      };
    case PARTY_TYPES.corporation:
      return {
        primary: new PetitionerCorporationContact(
          { ...contactInfo.primary, contactType: CONTACT_TYPES.primary },
          { applicationContext },
        ),
        secondary: null,
      };
    case PARTY_TYPES.custodian:
      return {
        primary: new PetitionerCustodianContact(
          { ...contactInfo.primary, contactType: CONTACT_TYPES.primary },
          { applicationContext },
        ),
        secondary: null,
      };
    case PARTY_TYPES.estate:
      return {
        primary: new PetitionerEstateWithExecutorPrimaryContact(
          { ...contactInfo.primary, contactType: CONTACT_TYPES.primary },
          { applicationContext },
        ),
        secondary: null,
      };
    case PARTY_TYPES.estateWithoutExecutor:
      return {
        primary: new PetitionerIntermediaryContact(
          { ...contactInfo.primary, contactType: CONTACT_TYPES.primary },
          { applicationContext },
        ),
        secondary: null,
      };
    case PARTY_TYPES.guardian:
      return {
        primary: new PetitionerGuardianContact(
          { ...contactInfo.primary, contactType: CONTACT_TYPES.primary },
          { applicationContext },
        ),
        secondary: null,
      };
    case PARTY_TYPES.nextFriendForIncompetentPerson:
      return {
        primary: new NextFriendForIncompetentPersonContact(
          { ...contactInfo.primary, contactType: CONTACT_TYPES.primary },
          { applicationContext },
        ),
        secondary: null,
      };
    case PARTY_TYPES.nextFriendForMinor:
      return {
        primary: new NextFriendForMinorContact(
          { ...contactInfo.primary, contactType: CONTACT_TYPES.primary },
          { applicationContext },
        ),
        secondary: null,
      };
    case PARTY_TYPES.partnershipAsTaxMattersPartner:
      return {
        primary: new PartnershipAsTaxMattersPartnerPrimaryContact(
          { ...contactInfo.primary, contactType: CONTACT_TYPES.primary },
          { applicationContext },
        ),
        secondary: null,
      };
    case PARTY_TYPES.partnershipBBA:
      return {
        primary: new PartnershipBBAPrimaryContact(
          { ...contactInfo.primary, contactType: CONTACT_TYPES.primary },
          { applicationContext },
        ),
        secondary: null,
      };
    case PARTY_TYPES.partnershipOtherThanTaxMatters:
      return {
        primary: new PartnershipOtherThanTaxMattersPrimaryContact(
          { ...contactInfo.primary, contactType: CONTACT_TYPES.primary },
          { applicationContext },
        ),
        secondary: null,
      };
    case PARTY_TYPES.petitionerDeceasedSpouse:
      return {
        primary: new PetitionerPrimaryContact(
          { ...contactInfo.primary, contactType: CONTACT_TYPES.primary },
          { applicationContext },
        ),
        secondary: new PetitionerDeceasedSpouseContact(
          { ...contactInfo.secondary, contactType: CONTACT_TYPES.secondary },
          { applicationContext },
        ),
      };
    case PARTY_TYPES.petitionerSpouse:
      return {
        primary: new PetitionerPrimaryContact(
          { ...contactInfo.primary, contactType: CONTACT_TYPES.primary },
          { applicationContext },
        ),
        secondary: new PetitionerSpouseContact(
          { ...contactInfo.secondary, contactType: CONTACT_TYPES.secondary },
          { applicationContext },
        ),
      };
    case PARTY_TYPES.survivingSpouse:
      return {
        primary: new SurvivingSpouseContact(
          { ...contactInfo.primary, contactType: CONTACT_TYPES.primary },
          { applicationContext },
        ),
        secondary: null,
      };
    case PARTY_TYPES.trust:
      return {
        primary: new PetitionerTrustContact(
          { ...contactInfo.primary, contactType: CONTACT_TYPES.primary },
          { applicationContext },
        ),
        secondary: null,
      };
    default:
      if (partyType) {
        throw new Error(`Unrecognized party type "${partyType}"`);
      }
      return {
        primary: {},
        secondary: null,
      };
  }
}
