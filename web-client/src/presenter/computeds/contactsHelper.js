import { state } from 'cerebral';

/**
 * gets the contact view options based on partyType
 *
 * @param {Function} get the cerebral get function used
 * for getting state.form.partyType and state.constants
 * @param {object} applicationContext the application context
 * @returns {object} the contactPrimary and/or contactSecondary
 * view options
 */
export const contactsHelper = (get, applicationContext) => {
  const form = get(state.form);
  const user = applicationContext.getCurrentUser();
  const { PARTY_TYPES, USER_ROLES } = applicationContext.getConstants();

  let contactPrimary, contactSecondary;
  let showEmail = true;
  if (user.role === USER_ROLES.petitioner) {
    switch (form.partyType) {
      case PARTY_TYPES.conservator:
        contactPrimary = {
          displaySecondaryName: true,
          header: 'Tell Us About Yourself as the Conservator for This Taxpayer',
          nameLabel: 'Name of taxpayer',
          secondaryNameLabel: 'Name of conservator',
        };
        break;
      case PARTY_TYPES.corporation:
        contactPrimary = {
          displayInCareOf: true,
          header: 'Tell Us About the Corporation You Are Filing For',
          inCareOfLabel: 'In care of',
          inCareOfLabelHint: 'optional',
          nameLabel: 'Business name',
        };
        break;
      case PARTY_TYPES.custodian:
        contactPrimary = {
          displaySecondaryName: true,
          header: 'Tell Us About Yourself as the Custodian for This Taxpayer',
          nameLabel: 'Name of taxpayer',
          secondaryNameLabel: 'Name of custodian',
        };
        break;
      case PARTY_TYPES.donor:
        contactPrimary = {
          header: 'Tell Us About the Donor You Are Filing For',
          nameLabel: 'Name of petitioner',
        };
        break;
      case PARTY_TYPES.estate:
        contactPrimary = {
          displaySecondaryName: true,
          displayTitle: true,
          header:
            'Tell Us About Yourself as the Executor/Personal Representative/etc. For This Estate',
          nameLabel: 'Name of decedent',
          secondaryNameLabel: 'Name of executor/personal representative, etc.',
        };
        break;
      case PARTY_TYPES.estateWithoutExecutor:
        contactPrimary = {
          displayInCareOf: true,
          header: 'Tell Us About the Estate You Are Filing For',
          inCareOfLabel: 'In care of',
          inCareOfLabelHint: 'optional',
          nameLabel: 'Name of decedent',
        };
        break;
      case PARTY_TYPES.guardian:
        contactPrimary = {
          displaySecondaryName: true,
          header: 'Tell Us About Yourself as the Guardian for This Taxpayer',
          nameLabel: 'Name of taxpayer',
          secondaryNameLabel: 'Name of guardian',
        };
        break;
      case PARTY_TYPES.nextFriendForIncompetentPerson:
        contactPrimary = {
          displaySecondaryName: true,
          header:
            'Tell Us About Yourself as the Next Friend for This Legally Incompetent Person',
          nameLabel: 'Name of legally incompetent person',
          secondaryNameLabel: 'Name of next friend',
        };
        break;
      case PARTY_TYPES.nextFriendForMinor:
        contactPrimary = {
          displaySecondaryName: true,
          header: 'Tell Us About Yourself as the Next Friend for This Minor',
          nameLabel: 'Name of minor',
          secondaryNameLabel: 'Name of next friend',
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
          nameLabel: 'Partnership name',
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
          secondaryNameLabel: 'Name of surviving spouse',
        };
        break;
      case PARTY_TYPES.transferee:
        contactPrimary = {
          header: 'Tell Us About the Transferee You Are Filing For',
          nameLabel: 'Name of petitioner',
        };
        break;
      case PARTY_TYPES.trust:
        contactPrimary = {
          displaySecondaryName: true,
          header: 'Tell Us About Yourself as the Trustee',
          nameLabel: 'Name of trust',
          secondaryNameLabel: 'Name of trustee',
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
          nameLabel: 'Name of taxpayer',
          secondaryNameLabel: 'Name of conservator',
        };
        break;
      case PARTY_TYPES.corporation:
        contactPrimary = {
          displayInCareOf: true,
          header: 'Tell Us About the Corporation You Are Filing For',
          inCareOfLabel: 'In care of',
          inCareOfLabelHint: 'optional',
          nameLabel: 'Business name',
        };
        break;
      case PARTY_TYPES.custodian:
        contactPrimary = {
          displaySecondaryName: true,
          header: 'Tell Us About the Custodian for This Taxpayer',
          nameLabel: 'Name of taxpayer',
          secondaryNameLabel: 'Name of custodian',
        };
        break;
      case PARTY_TYPES.donor:
        contactPrimary = {
          header: 'Tell Us About the Donor You Are Filing For',
          nameLabel: 'Name of petitioner',
        };
        break;
      case PARTY_TYPES.estate:
        contactPrimary = {
          displaySecondaryName: true,
          displayTitle: true,
          header:
            'Tell Us About the Executor/Personal Representative/etc. For This Estate',
          nameLabel: 'Name of decedent',
          secondaryNameLabel: 'Name of executor/personal representative, etc.',
        };
        break;
      case PARTY_TYPES.estateWithoutExecutor:
        contactPrimary = {
          displayInCareOf: true,
          header: 'Tell Us About the Estate You Are Filing For',
          inCareOfLabel: 'In care of',
          nameLabel: 'Name of decedent',
        };
        break;
      case PARTY_TYPES.guardian:
        contactPrimary = {
          displaySecondaryName: true,
          header: 'Tell Us About the Guardian for This Taxpayer',
          nameLabel: 'Name of taxpayer',
          secondaryNameLabel: 'Name of guardian',
        };
        break;
      case PARTY_TYPES.nextFriendForIncompetentPerson:
        contactPrimary = {
          displaySecondaryName: true,
          header:
            'Tell Us About the Next Friend for This Legally Incompetent Person',
          nameLabel: 'Name of legally incompetent person',
          secondaryNameLabel: 'Name of next friend',
        };
        break;
      case PARTY_TYPES.nextFriendForMinor:
        contactPrimary = {
          displaySecondaryName: true,
          header: 'Tell Us About the Next Friend for This Minor',
          nameLabel: 'Name of minor',
          secondaryNameLabel: 'Name of next friend',
        };
        break;
      case PARTY_TYPES.partnershipBBA:
        contactPrimary = {
          displaySecondaryName: true,
          header: 'Tell Us About the Partnership Representative',
          nameLabel: 'Business name',
          secondaryNameLabel: 'Name of partnership representative',
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
          secondaryNameLabel: 'Name of surviving spouse',
        };
        break;
      case PARTY_TYPES.transferee:
        contactPrimary = {
          header: 'Tell Us About the Transferee You Are Filing For',
          nameLabel: 'Name of petitioner',
        };
        break;
      case PARTY_TYPES.trust:
        contactPrimary = {
          displaySecondaryName: true,
          header: 'Tell Us About the Trustee',
          nameLabel: 'Name of trust',
          secondaryNameLabel: 'Name of trustee',
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
