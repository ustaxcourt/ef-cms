import { state } from 'cerebral';

/**
 * gets the contact view options based on partyType
 *
 * @param {Function} get the cerebral get function used
 * for getting state.form.partyType and state.constants
 * @returns {object} the contactPrimary and/or contactSecondary
 * view options
 */
export const contactsHelper = get => {
  const form = get(state.form);
  const userRole = get(state.user.role);
  const { PARTY_TYPES } = get(state.constants);

  let contactPrimary, contactSecondary;
  let showEmail = true;
  if (userRole === 'petitioner') {
    switch (form.partyType) {
      case PARTY_TYPES.conservator:
        contactPrimary = {
          displaySecondaryName: true,
          header: 'Tell Us About Yourself as the Conservator for This Taxpayer',
          nameLabel: 'Name of Taxpayer',
          secondaryNameLabel: 'Name of Conservator',
        };
        break;
      case PARTY_TYPES.corporation:
        contactPrimary = {
          displayInCareOf: true,
          header: 'Tell Us About the Corporation You Are Filing For',
          inCareOfLabel: 'In care of',
          inCareOfLabelHint: 'Your Name',
          nameLabel: 'Business name',
        };
        break;
      case PARTY_TYPES.custodian:
        contactPrimary = {
          displaySecondaryName: true,
          header: 'Tell Us About Yourself as the Custodian for This Taxpayer',
          nameLabel: 'Name of Taxpayer',
          secondaryNameLabel: 'Name of Custodian',
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
          displaySecondaryName: true,
          displayTitle: true,
          header:
            'Tell Us About Yourself as the Executor/Personal Representative/etc. For This Estate',
          nameLabel: 'Name of Decedent',
          secondaryNameLabel: 'Name of Executor/Personal Representative, etc.',
        };
        break;
      case PARTY_TYPES.estateWithoutExecutor:
        contactPrimary = {
          displayInCareOf: true,
          header: 'Tell Us About the Estate You Are Filing For',
          inCareOfLabel: 'In care of',
          inCareOfLabelHint: 'Your Name',
          nameLabel: 'Name of Decedent',
        };
        break;
      case PARTY_TYPES.guardian:
        contactPrimary = {
          displaySecondaryName: true,
          header: 'Tell Us About Yourself as the Guardian for This Taxpayer',
          nameLabel: 'Name of Taxpayer',
          secondaryNameLabel: 'Name of Guardian',
        };
        break;
      case PARTY_TYPES.nextFriendForIncompetentPerson:
        contactPrimary = {
          displaySecondaryName: true,
          header:
            'Tell Us About Yourself as the Next Friend for This Legally Incompetent Person',
          nameLabel: 'Name of Legally Incompetent Person',
          secondaryNameLabel: 'Name of Next Friend',
        };
        break;
      case PARTY_TYPES.nextFriendForMinor:
        contactPrimary = {
          displaySecondaryName: true,
          header: 'Tell Us About Yourself as the Next Friend for This Minor',
          nameLabel: 'Name of Minor',
          secondaryNameLabel: 'Name of Next Friend',
        };
        break;
      case PARTY_TYPES.partnershipBBA:
        contactPrimary = {
          displaySecondaryName: true,
          header: 'Tell Us About Yourself as the Partnership Representative',
          nameLabel: 'Business name',
          secondaryNameLabel: 'Partnership representative name',
        };
        break;
      case PARTY_TYPES.partnershipOtherThanTaxMatters:
        contactPrimary = {
          displaySecondaryName: true,
          header:
            'Tell Us About Yourself as the Partner (Other than Tax Matters Partner)',
          nameLabel: 'Business name',
          secondaryNameLabel: 'Name of partner (other than TMP)',
        };
        break;
      case PARTY_TYPES.partnershipAsTaxMattersPartner:
        contactPrimary = {
          displaySecondaryName: true,
          header: 'Tell Us About Yourself as the Tax Matters Partner',
          nameLabel: 'Partnership Name',
          secondaryNameLabel: 'Tax Matters Partner name',
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
          displayPhone: true,
          header: 'Tell Us About Yourself',
          nameLabel: 'Name',
        };
        contactSecondary = {
          displayPhone: true,
          header: 'Tell Us About Your Spouse',
          nameLabel: "Spouse's name",
        };
        break;
      case PARTY_TYPES.petitionerDeceasedSpouse:
        contactPrimary = {
          header: 'Tell Us About Yourself',
          nameLabel: 'Name of petitioner/surviving spouse',
        };
        contactSecondary = {
          displayInCareOf: true,
          displayPhone: true,
          header: 'Tell Us About Your Deceased Spouse',
          inCareOfLabel: 'In care of',
          nameLabel: 'Name of deceased spouse',
        };
        break;
      case PARTY_TYPES.survivingSpouse:
        contactPrimary = {
          displaySecondaryName: true,
          header: 'Tell Us About Yourself as the Surviving Spouse',
          nameLabel: 'Name of deceased spouse',
          secondaryNameLabel: 'Name of Surviving Spouse',
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
          displaySecondaryName: true,
          header: 'Tell Us About Yourself as the Trustee',
          nameLabel: 'Name of Trust',
          secondaryNameLabel: 'Name of Trustee',
        };
        break;
    }
  } else {
    showEmail = false;

    switch (form.partyType) {
      case PARTY_TYPES.conservator:
        contactPrimary = {
          displaySecondaryName: true,
          header: 'Tell Us About the Conservator for This Taxpayer',
          nameLabel: 'Name of Taxpayer',
          secondaryNameLabel: 'Name of Conservator',
        };
        break;
      case PARTY_TYPES.corporation:
        contactPrimary = {
          displayInCareOf: true,
          header: 'Tell Us About the Corporation You Are Filing For',
          inCareOfLabel: 'In care of',
          nameLabel: 'Business name',
        };
        break;
      case PARTY_TYPES.custodian:
        contactPrimary = {
          displaySecondaryName: true,
          header: 'Tell Us About the Custodian for This Taxpayer',
          nameLabel: 'Name of Taxpayer',
          secondaryNameLabel: 'Name of Custodian',
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
          displaySecondaryName: true,
          displayTitle: true,
          header:
            'Tell Us About the Executor/Personal Representative/etc. For This Estate',
          nameLabel: 'Name of Decedent',
          secondaryNameLabel: 'Name of Executor/Personal Representative, etc.',
        };
        break;
      case PARTY_TYPES.estateWithoutExecutor:
        contactPrimary = {
          displayInCareOf: true,
          header: 'Tell Us About the Estate You Are Filing For',
          inCareOfLabel: 'In care of',
          nameLabel: 'Name of Decedent',
        };
        break;
      case PARTY_TYPES.guardian:
        contactPrimary = {
          displaySecondaryName: true,
          header: 'Tell Us About the Guardian for This Taxpayer',
          nameLabel: 'Name of Taxpayer',
          secondaryNameLabel: 'Name of Guardian',
        };
        break;
      case PARTY_TYPES.nextFriendForIncompetentPerson:
        contactPrimary = {
          displaySecondaryName: true,
          header:
            'Tell Us About the Next Friend for This Legally Incompetent Person',
          nameLabel: 'Name of Legally Incompetent Person',
          secondaryNameLabel: 'Name of Next Friend',
        };
        break;
      case PARTY_TYPES.nextFriendForMinor:
        contactPrimary = {
          displaySecondaryName: true,
          header: 'Tell Us About the Next Friend for This Minor',
          nameLabel: 'Name of Minor',
          secondaryNameLabel: 'Name of Next Friend',
        };
        break;
      case PARTY_TYPES.partnershipBBA:
        contactPrimary = {
          displaySecondaryName: true,
          header: 'Tell Us About the Partnership Representative',
          nameLabel: 'Business name',
          secondaryNameLabel: 'Name of Partnership Representative',
        };
        break;
      case PARTY_TYPES.partnershipOtherThanTaxMatters:
        contactPrimary = {
          displaySecondaryName: true,
          header: 'Tell Us About the Partner (Other than Tax Matters Partner)',
          nameLabel: 'Business name',
          secondaryNameLabel: 'Name of partner (other than TMP)',
        };
        break;
      case PARTY_TYPES.partnershipAsTaxMattersPartner:
        contactPrimary = {
          displaySecondaryName: true,
          header: 'Tell Us About the Tax Matters Partner',
          nameLabel: 'Name of Partnership',
          secondaryNameLabel: 'Name of Tax Matters Partner',
        };
        break;
      case PARTY_TYPES.petitioner:
        contactPrimary = {
          header: 'Tell Us About the Petitioner',
          nameLabel: 'Name',
        };
        break;
      case PARTY_TYPES.petitionerSpouse:
        contactPrimary = {
          displayPhone: true,
          header: 'Tell Us About the First Petitioner',
          nameLabel: 'Name',
        };
        contactSecondary = {
          displayPhone: true,
          header: 'Tell Us About the Second Petitioner',
          nameLabel: 'Name',
        };
        break;
      case PARTY_TYPES.petitionerDeceasedSpouse:
        contactPrimary = {
          header: 'Tell Us About the Petitioner',
          nameLabel: 'Name',
        };
        contactSecondary = {
          displayInCareOf: true,
          displayPhone: true,
          header: 'Tell Us About the Deceased Petitioner',
          inCareOfLabel: 'In care of',
          nameLabel: 'Deceased Petitioner Name',
        };
        break;
      case PARTY_TYPES.survivingSpouse:
        contactPrimary = {
          displaySecondaryName: true,
          header: 'Tell Us About the Surviving Spouse',
          nameLabel: 'Name of deceased spouse',
          secondaryNameLabel: 'Name of Surviving Spouse',
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
          displaySecondaryName: true,
          header: 'Tell Us About the Trustee',
          nameLabel: 'Name of Trust',
          secondaryNameLabel: 'Name of Trustee',
        };
        break;
    }
  }

  return {
    contactPrimary,
    contactSecondary,
    showEmail,
  };
};
