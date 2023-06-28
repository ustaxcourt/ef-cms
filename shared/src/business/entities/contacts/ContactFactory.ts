import { CONTACT_TYPES, PARTY_TYPES } from '../EntityConstants';
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

const ContactFactory = {} as any;

ContactFactory.getContactConstructors = ({ partyType }) => {
  switch (partyType) {
    case PARTY_TYPES.donor:
    case PARTY_TYPES.transferee:
    case PARTY_TYPES.petitioner:
      return {
        primary: PetitionerPrimaryContact,
        secondary: null,
      };
    case PARTY_TYPES.conservator:
      return {
        primary: PetitionerConservatorContact,
        secondary: null,
      };
    case PARTY_TYPES.corporation:
      return {
        primary: PetitionerCorporationContact,
        secondary: null,
      };
    case PARTY_TYPES.custodian:
      return {
        primary: PetitionerCustodianContact,
        secondary: null,
      };
    case PARTY_TYPES.estate:
      return {
        primary: PetitionerEstateWithExecutorPrimaryContact,
        secondary: null,
      };
    case PARTY_TYPES.estateWithoutExecutor:
      return {
        primary: PetitionerIntermediaryContact,
        secondary: null,
      };
    case PARTY_TYPES.guardian:
      return {
        primary: PetitionerGuardianContact,
        secondary: null,
      };
    case PARTY_TYPES.nextFriendForIncompetentPerson:
      return {
        primary: NextFriendForIncompetentPersonContact,
        secondary: null,
      };
    case PARTY_TYPES.nextFriendForMinor:
      return {
        primary: NextFriendForMinorContact,
        secondary: null,
      };
    case PARTY_TYPES.partnershipAsTaxMattersPartner:
      return {
        primary: PartnershipAsTaxMattersPartnerPrimaryContact,
        secondary: null,
      };
    case PARTY_TYPES.partnershipBBA:
      return {
        primary: PartnershipBBAPrimaryContact,
        secondary: null,
      };
    case PARTY_TYPES.partnershipOtherThanTaxMatters:
      return {
        primary: PartnershipOtherThanTaxMattersPrimaryContact,
        secondary: null,
      };
    case PARTY_TYPES.petitionerDeceasedSpouse:
      return {
        primary: PetitionerPrimaryContact,
        secondary: PetitionerDeceasedSpouseContact,
      };
    case PARTY_TYPES.petitionerSpouse:
      return {
        primary: PetitionerPrimaryContact,
        secondary: PetitionerSpouseContact,
      };
    case PARTY_TYPES.survivingSpouse:
      return {
        primary: SurvivingSpouseContact,
        secondary: null,
      };
    case PARTY_TYPES.trust:
      return {
        primary: PetitionerTrustContact,
        secondary: null,
      };
    default:
      if (partyType) {
        throw new Error(`Unrecognized party type "${partyType}"`);
      }
      return {};
  }
};

ContactFactory.createContacts = ({
  applicationContext,
  contactInfo,
  partyType,
}) => {
  const constructorMap = ContactFactory.getContactConstructors({
    partyType,
  });

  return {
    primary: constructorMap.primary
      ? new constructorMap.primary(
          { ...contactInfo.primary, contactType: CONTACT_TYPES.primary },
          {
            applicationContext,
          },
        )
      : {},
    secondary: constructorMap.secondary
      ? new constructorMap.secondary(
          { ...contactInfo.secondary, contactType: CONTACT_TYPES.secondary },
          {
            applicationContext,
          },
        )
      : undefined,
  };
};

exports.ContactFactory = ContactFactory;
