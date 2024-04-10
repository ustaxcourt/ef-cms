import { state } from '@web-client/presenter/app.cerebral';

/**
 * gets the contact view options based on partyType
 *
 * @param {Function} get the cerebral get function used
 * for getting state.form.partyType and state.constants
 * @param {object} applicationContext the application context
 * @returns {object} the contactPrimary and/or contactSecondary
 * view options
 */
import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';

export const contactsHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const form = get(state.form);
  const user = applicationContext.getCurrentUser();
  const { PARTY_TYPES, USER_ROLES } = applicationContext.getConstants();

  let contactPrimary, contactSecondary;
  let showEmail = user.role !== USER_ROLES.petitioner;

  if (user.role === USER_ROLES.petitioner) {
    ({ contactPrimary, contactSecondary } = contactHelperForPetitioner({
      PARTY_TYPES,
      partyType: form.partyType,
    }));
  } else {
    ({ contactPrimary, contactSecondary } = contactHelperForNonPetitioner({
      PARTY_TYPES,
      partyType: form.partyType,
    }));
  }
  return {
    contactPrimary,
    contactSecondary,
    showEmail,
  };
};

const contactHelperForPetitioner = ({ PARTY_TYPES, partyType }) => {
  const contactTypes = {
    [PARTY_TYPES.conservator]: {
      contactPrimary: {
        displaySecondaryName: true,
        header: 'Tell Us About Yourself as the Conservator for This Taxpayer',
        nameLabel: 'Name of taxpayer',
        secondaryNameLabel: 'Name of conservator',
      },
    },
    [PARTY_TYPES.corporation]: {
      contactPrimary: {
        displayInCareOf: true,
        header: 'Tell Us About the Corporation You Are Filing For',
        inCareOfLabel: 'In care of',
        inCareOfLabelHint: 'optional',
        nameLabel: 'Business name',
      },
    },
    [PARTY_TYPES.custodian]: {
      contactPrimary: {
        displaySecondaryName: true,
        header: 'Tell Us About Yourself as the Custodian for This Taxpayer',
        nameLabel: 'Name of taxpayer',
        secondaryNameLabel: 'Name of custodian',
      },
    },
    [PARTY_TYPES.donor]: {
      contactPrimary: {
        header: 'Tell Us About the Donor You Are Filing For',
        nameLabel: 'Name of petitioner',
      },
    },
    [PARTY_TYPES.estate]: {
      contactPrimary: {
        displaySecondaryName: true,
        displayTitle: true,
        header:
          'Tell Us About Yourself as the Executor/Personal Representative/etc. For This Estate',
        nameLabel: 'Name of decedent',
        secondaryNameLabel: 'Name of executor/personal representative, etc.',
      },
    },
    [PARTY_TYPES.estateWithoutExecutor]: {
      contactPrimary: {
        displayInCareOf: true,
        header: 'Tell Us About the Estate You Are Filing For',
        inCareOfLabel: 'In care of',
        inCareOfLabelHint: 'optional',
        nameLabel: 'Name of decedent',
      },
    },
    [PARTY_TYPES.guardian]: {
      contactPrimary: {
        displaySecondaryName: true,
        header: 'Tell Us About Yourself as the Guardian for This Taxpayer',
        nameLabel: 'Name of taxpayer',
        secondaryNameLabel: 'Name of guardian',
      },
    },
    [PARTY_TYPES.nextFriendForIncompetentPerson]: {
      contactPrimary: {
        displaySecondaryName: true,
        header:
          'Tell Us About Yourself as the Next Friend for This Legally Incompetent Person',
        nameLabel: 'Name of legally incompetent person',
        secondaryNameLabel: 'Name of next friend',
      },
    },
    [PARTY_TYPES.nextFriendForMinor]: {
      contactPrimary: {
        displaySecondaryName: true,
        header: 'Tell Us About Yourself as the Next Friend for This Minor',
        nameLabel: 'Name of minor',
        secondaryNameLabel: 'Name of next friend',
      },
    },
    [PARTY_TYPES.partnershipBBA]: {
      contactPrimary: {
        displaySecondaryName: true,
        header: 'Tell Us About Yourself as the Partnership Representative',
        nameLabel: 'Business name',
        secondaryNameLabel: 'Partnership representative name',
      },
    },
    [PARTY_TYPES.partnershipOtherThanTaxMatters]: {
      contactPrimary: {
        displaySecondaryName: true,
        header:
          'Tell Us About Yourself as the Partner (Other than Tax Matters Partner)',
        nameLabel: 'Business name',
        secondaryNameLabel: 'Name of partner (other than TMP)',
      },
    },
    [PARTY_TYPES.partnershipAsTaxMattersPartner]: {
      contactPrimary: {
        displaySecondaryName: true,
        header: 'Tell Us About Yourself as the Tax Matters Partner',
        nameLabel: 'Partnership name',
        secondaryNameLabel: 'Tax Matters Partner name',
      },
    },
    [PARTY_TYPES.petitioner]: {
      contactPrimary: {
        header: 'Tell Us About Yourself',
        nameLabel: 'Name',
      },
    },
    [PARTY_TYPES.petitionerSpouse]: {
      contactPrimary: {
        displayPhone: true,
        header: 'Tell Us About Yourself',
        nameLabel: 'Name',
      },
      contactSecondary: {
        displayPhone: true,
        header: 'Tell Us About Your Spouse',
        nameLabel: 'Spouse’s name',
      },
    },
    [PARTY_TYPES.petitionerDeceasedSpouse]: {
      contactPrimary: {
        header: 'Tell Us About Yourself',
        nameLabel: 'Name of petitioner/surviving spouse',
      },
      contactSecondary: {
        displayInCareOf: true,
        displayPhone: true,
        header: 'Tell Us About Your Deceased Spouse',
        inCareOfLabel: 'In care of',
        nameLabel: 'Name of deceased spouse',
      },
    },
    [PARTY_TYPES.survivingSpouse]: {
      contactPrimary: {
        displaySecondaryName: true,
        header: 'Tell Us About Yourself as the Surviving Spouse',
        nameLabel: 'Name of deceased spouse',
        secondaryNameLabel: 'Name of surviving spouse',
      },
    },
    [PARTY_TYPES.transferee]: {
      contactPrimary: {
        header: 'Tell Us About the Transferee You Are Filing For',
        nameLabel: 'Name of petitioner',
      },
    },
    [PARTY_TYPES.trust]: {
      contactPrimary: {
        displaySecondaryName: true,
        header: 'Tell Us About Yourself as the Trustee',
        nameLabel: 'Name of trust',
        secondaryNameLabel: 'Name of trustee',
      },
    },
  };
  return contactTypes[partyType] ?? {};
};

const contactHelperForNonPetitioner = ({ PARTY_TYPES, partyType }) => {
  const contactTypes = {
    [PARTY_TYPES.conservator]: {
      contactPrimary: {
        displaySecondaryName: true,
        header: 'Tell Us About the Conservator for This Taxpayer',
        nameLabel: 'Name of taxpayer',
        secondaryNameLabel: 'Name of conservator',
      },
    },
    [PARTY_TYPES.corporation]: {
      contactPrimary: {
        displayInCareOf: true,
        header: 'Tell Us About the Corporation You Are Filing For',
        inCareOfLabel: 'In care of',
        inCareOfLabelHint: 'optional',
        nameLabel: 'Business name',
      },
    },
    [PARTY_TYPES.custodian]: {
      contactPrimary: {
        displaySecondaryName: true,
        header: 'Tell Us About the Custodian for This Taxpayer',
        nameLabel: 'Name of taxpayer',
        secondaryNameLabel: 'Name of custodian',
      },
    },
    [PARTY_TYPES.donor]: {
      contactPrimary: {
        header: 'Tell Us About the Donor You Are Filing For',
        nameLabel: 'Name of petitioner',
      },
    },
    [PARTY_TYPES.estate]: {
      contactPrimary: {
        displaySecondaryName: true,
        displayTitle: true,
        header:
          'Tell Us About the Executor/Personal Representative/etc. For This Estate',
        nameLabel: 'Name of decedent',
        secondaryNameLabel: 'Name of executor/personal representative, etc.',
      },
    },
    [PARTY_TYPES.estateWithoutExecutor]: {
      contactPrimary: {
        displayInCareOf: true,
        header: 'Tell Us About the Estate You Are Filing For',
        inCareOfLabel: 'In care of',
        nameLabel: 'Name of decedent',
      },
    },
    [PARTY_TYPES.guardian]: {
      contactPrimary: {
        displaySecondaryName: true,
        header: 'Tell Us About the Guardian for This Taxpayer',
        nameLabel: 'Name of taxpayer',
        secondaryNameLabel: 'Name of guardian',
      },
    },
    [PARTY_TYPES.nextFriendForIncompetentPerson]: {
      contactPrimary: {
        displaySecondaryName: true,
        header:
          'Tell Us About the Next Friend for This Legally Incompetent Person',
        nameLabel: 'Name of legally incompetent person',
        secondaryNameLabel: 'Name of next friend',
      },
    },
    [PARTY_TYPES.nextFriendForMinor]: {
      contactPrimary: {
        displaySecondaryName: true,
        header: 'Tell Us About the Next Friend for This Minor',
        nameLabel: 'Name of minor',
        secondaryNameLabel: 'Name of next friend',
      },
    },
    [PARTY_TYPES.partnershipBBA]: {
      contactPrimary: {
        displaySecondaryName: true,
        header: 'Tell Us About the Partnership Representative',
        nameLabel: 'Business name',
        secondaryNameLabel: 'Name of partnership representative',
      },
    },
    [PARTY_TYPES.partnershipOtherThanTaxMatters]: {
      contactPrimary: {
        displaySecondaryName: true,
        header: 'Tell Us About the Partner (Other than Tax Matters Partner)',
        nameLabel: 'Business name',
        secondaryNameLabel: 'Name of partner (other than TMP)',
      },
    },
    [PARTY_TYPES.partnershipAsTaxMattersPartner]: {
      contactPrimary: {
        displaySecondaryName: true,
        header: 'Tell Us About the Tax Matters Partner',
        nameLabel: 'Name of Partnership',
        secondaryNameLabel: 'Name of Tax Matters Partner',
      },
    },
    [PARTY_TYPES.petitioner]: {
      contactPrimary: {
        header: 'Tell Us About the Petitioner',
        nameLabel: 'Name',
      },
    },
    [PARTY_TYPES.petitionerSpouse]: {
      contactPrimary: {
        displayPhone: true,
        header: 'Tell Us About the First Petitioner',
        nameLabel: 'Name',
      },
      contactSecondary: {
        displayPhone: true,
        header: 'Tell Us About the Second Petitioner',
        nameLabel: 'Name',
      },
    },
    [PARTY_TYPES.petitionerDeceasedSpouse]: {
      contactPrimary: {
        header: 'Tell Us About the Petitioner',
        nameLabel: 'Name',
      },
      contactSecondary: {
        displayInCareOf: true,
        displayPhone: true,
        header: 'Tell Us About the Deceased Petitioner',
        inCareOfLabel: 'In care of',
        nameLabel: 'Deceased Petitioner Name',
      },
    },
    [PARTY_TYPES.survivingSpouse]: {
      contactPrimary: {
        displaySecondaryName: true,
        header: 'Tell Us About the Surviving Spouse',
        nameLabel: 'Name of deceased spouse',
        secondaryNameLabel: 'Name of surviving spouse',
      },
    },
    [PARTY_TYPES.transferee]: {
      contactPrimary: {
        header: 'Tell Us About the Transferee You Are Filing For',
        nameLabel: 'Name of petitioner',
      },
    },
    [PARTY_TYPES.trust]: {
      contactPrimary: {
        displaySecondaryName: true,
        header: 'Tell Us About the Trustee',
        nameLabel: 'Name of trust',
        secondaryNameLabel: 'Name of trustee',
      },
    },
  };
  return contactTypes[partyType] ?? {};
};
