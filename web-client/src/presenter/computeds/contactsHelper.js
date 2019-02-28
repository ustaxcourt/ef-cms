import { state } from 'cerebral';

const {
  PARTY_TYPES,
} = require('../../../../shared/src/business/entities/Contacts/PetitionContact');

export const contactsHelper = get => {
  const form = get(state.form);

  let contactPrimary, contactSecondary;
  switch (form.partyType) {
    case PARTY_TYPES.conservator:
      contactPrimary = {
        header: 'Tell Us About Yourself as the Conservator for This Taxpayer',
        nameLabel: 'Name of Conservator',
      };
      contactSecondary = {
        header: 'Tell Us About the Taxpayer You Are Filing For',
        nameLabel: 'Name of Taxpayer',
        displayInCareOf: true,
        displayPhone: true,
      };
      break;
    case PARTY_TYPES.corporation:
      contactPrimary = {
        header: 'Tell Us About the Corporation You Are Filing For',
        nameLabel: 'Business Name',
        inCareOfLabel: 'In Care Of',
        inCareOfLabelHint: 'Your Name',
        displayInCareOf: true,
      };
      break;
    case PARTY_TYPES.custodian:
      contactPrimary = {
        header: 'Tell Us About Yourself as the Custodian for This Taxpayer',
        nameLabel: 'Name of Custodian',
      };
      contactSecondary = {
        header: 'Tell Us About the Taxpayer You Are Filing For',
        nameLabel: 'Name of Taxpayer',
        displayInCareOf: true,
        displayPhone: true,
      };
      break;
    case PARTY_TYPES.donor:
      contactPrimary = {
        header: 'Tell Us About the Donor You Are Filing For',
        nameLabel: 'Name of Petitioner',
      };
      break;
    case PARTY_TYPES.estate:
      contactPrimary = {
        header:
          'Tell Us About Yourself as the Executor/Personal Representative/etc. For This Estate',
        nameLabel: 'Name of Executor/Personal Representative, etc.',
        displayTitle: true,
      };
      contactSecondary = {
        header: 'Tell Us About the Estate You Are Filing For',
        nameLabel: 'Name of Decedent',
      };
      break;
    case PARTY_TYPES.estateWithoutExecutor:
      contactPrimary = {
        header: 'Tell Us About the Estate You Are Filing For',
        nameLabel: 'Name of Decedent',
        inCareOfLabel: 'In Care Of',
        inCareOfLabelHint: 'Your Name',
        displayInCareOf: true,
      };
      break;
    case PARTY_TYPES.guardian:
      contactPrimary = {
        header: 'Tell Us About Yourself as the Guardian for This Taxpayer',
        nameLabel: 'Name of Guardian',
      };
      contactSecondary = {
        header: 'Tell Us About the Taxpayer You Are Filing For',
        nameLabel: 'Name of Taxpayer',
        displayInCareOf: true,
        displayPhone: true,
      };
      break;
    case PARTY_TYPES.nextFriendForIncomponentPerson:
      contactPrimary = {
        header:
          'Tell Us About Yourself as the Next Friend for This Legally Incompetent Person',
        nameLabel: 'Name of Next Friend',
      };
      contactSecondary = {
        header:
          'Tell Us About the Legally Incompetent Person You Are Filing For',
        nameLabel: 'Name of Legally Incompetent Person',
        displayInCareOf: true,
        displayPhone: true,
      };
      break;
    case PARTY_TYPES.nextFriendForMinor:
      contactPrimary = {
        header: 'Tell Us About Yourself as the Next Friend for This Minor',
        nameLabel: 'Name of Next Friend',
      };
      contactSecondary = {
        header: 'Tell Us About the Minor You Are Filing For',
        nameLabel: 'Name of Minor',
        displayInCareOf: true,
        displayPhone: true,
      };
      break;
    case PARTY_TYPES.partnershipBBA:
      contactPrimary = {
        header: 'Tell Us About Yourself as the Partnership Representative',
        nameLabel: 'Name of Partnership Representative',
      };
      contactSecondary = {
        header: 'Tell Us About the Partnership You Are Filing For',
        nameLabel: 'Business Name',
        displayInCareOf: true,
        displayPhone: true,
      };
      break;
    case PARTY_TYPES.partnershipOtherThanTaxMatters:
      contactPrimary = {
        header:
          'Tell Us About Yourself as the Partner (Other than Tax Matters Partner)',
        nameLabel: 'Name of Partner (Other than a Tax Matters Partner)',
      };
      contactSecondary = {
        header: 'Tell Us About the Partnership You Are Filing For',
        nameLabel: 'Business Name',
        displayInCareOf: true,
        displayPhone: true,
      };
      break;
    case PARTY_TYPES.partnershipAsTaxMattersPartner:
      contactPrimary = {
        header: 'Tell Us About Yourself as the Tax Matters Partner',
        nameLabel: 'Name of Tax Matters Partner',
      };
      contactSecondary = {
        header: 'Tell Us About the Partnership You Are Filing For',
        nameLabel: 'Business Name',
        displayInCareOf: true,
        displayPhone: true,
      };
      break;
    case PARTY_TYPES.petitioner:
      contactPrimary = {
        header: 'Tell Us About Yourself',
        nameLabel: 'Name',
      };
      break;
    case PARTY_TYPES.petitionerSpouse:
      contactPrimary = {
        header: 'Tell Us About Yourself',
        nameLabel: 'Name',
        displayPhone: true,
      };
      contactSecondary = {
        header: 'Tell Us About Your Spouse',
        nameLabel: "Spouse's Name",
        displayPhone: true,
      };
      break;
    case PARTY_TYPES.petitionerDeceasedSpouse:
      contactPrimary = {
        header: 'Tell Us About Yourself',
        nameLabel: 'Name',
      };
      contactSecondary = {
        header: 'Tell Us About Your Deceased Spouse',
        nameLabel: "Spouse's Name",
      };
      break;
    case PARTY_TYPES.survivingSpouse:
      contactPrimary = {
        header: 'Tell Us About Yourself as the Surviving Spouse',
        nameLabel: 'Name',
      };
      contactSecondary = {
        header: 'Tell Us About Your Deceased Spouse',
        nameLabel: "Spouse's Name",
      };
      break;
    case PARTY_TYPES.transferee:
      contactPrimary = {
        header: 'Tell Us About the Transferee You Are Filing For',
        nameLabel: 'Name of Petitioner',
      };
      break;
    case PARTY_TYPES.trust:
      contactPrimary = {
        header: 'Tell Us About Yourself as the Trustee',
        nameLabel: 'Name of Trustee',
      };
      contactSecondary = {
        header: 'Tell Us About the Trust You Are Filing For',
        nameLabel: 'Name of Trust',
        displayInCareOf: true,
        displayPhone: true,
      };
      break;
  }

  return {
    contactPrimary: contactPrimary,
    contactSecondary: contactSecondary,
  };
};
