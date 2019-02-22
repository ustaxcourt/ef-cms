import { state } from 'cerebral';

export const contactsHelper = get => {
  const form = get(state.form);

  let contactPrimary, contactSecondary;
  switch (form.partyType) {
    case 'Conservator':
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
    case 'Corporation':
      contactPrimary = {
        header: 'Tell Us About the Corporation You Are Filing For',
        nameLabel: 'Business Name',
        displayInCareOf: true,
      };
      break;
    case 'Custodian':
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
    case 'Donor':
      contactPrimary = {
        header: 'Tell Us About the Donor You Are Filing For',
        nameLabel: 'Name of Petitioner',
      };
      break;
    case 'Estate with an Executor/Personal Representative/Fiduciary/etc.':
      contactPrimary = {
        header:
          'Tell Us About Yourself as the Executor/Personal Representative For This Estate',
        nameLabel: 'Name of Executor/Personal Representative',
        displayTitle: true,
      };
      contactSecondary = {
        header: 'Tell Us About the Estate You Are Filing For',
        nameLabel: 'Name of Decedent',
      };
      break;
    case 'Estate without an Executor/Personal Representative/Fiduciary/etc.':
      contactPrimary = {
        header: 'Tell Us About the Estate You Are Filing For',
        nameLabel: 'Name of Decedent',
        displayInCareOf: true,
      };
      break;
    case 'Guardian':
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
    case 'Next Friend for an Legally Incompetent Person (Without a Guardian, Conservator, or other like Fiduciary)':
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
    case 'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)':
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
    case 'Partnership (as a partnership representative under the BBA regime)':
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
    case 'Partnership (as a partner other than tax matters partner)':
      contactPrimary = {
        header:
          'Tell Us About Yourself as the Partner (Other than Tax Matters Partner)',
        nameLabel: 'Name of Partner',
      };
      contactSecondary = {
        header: 'Tell Us About the Partnership You Are Filing For',
        nameLabel: 'Business Name',
        displayInCareOf: true,
        displayPhone: true,
      };
      break;
    case 'Partnership (as the tax matters partner)':
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
    case 'Petitioner':
      contactPrimary = {
        header: 'Tell Us About Yourself',
        nameLabel: 'Name',
      };
      break;
    case 'Petitioner & Spouse':
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
    case 'Petitioner & Deceased Spouse':
      contactPrimary = {
        header: 'Tell Us About Yourself',
        nameLabel: 'Name',
      };
      contactSecondary = {
        header: 'Tell Us About Your Deceased Spouse',
        nameLabel: "Spouse's Name",
      };
      break;
    case 'Surviving Spouse':
      contactPrimary = {
        header: 'Tell Us About Yourself as the Surviving Spouse',
        nameLabel: 'Name',
      };
      contactSecondary = {
        header: 'Tell Us About Your Deceased Spouse',
        nameLabel: "Spouse's Name",
      };
      break;
    case 'Transferee':
      contactPrimary = {
        header: 'Tell Us About the Transferee You Are Filing For',
        nameLabel: 'Name of Petitioner',
      };
      break;
    case 'Trust':
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
