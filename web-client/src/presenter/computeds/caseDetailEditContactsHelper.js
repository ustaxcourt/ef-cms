import { state } from 'cerebral';

export const getOptionsForContact = ({ PARTY_TYPES, partyType }) => {
  let contacts;
  switch (partyType) {
    case PARTY_TYPES.conservator:
      contacts = {
        contactPrimary: {
          displaySecondaryName: true,
          header: 'Conservator Information',
          nameLabel: 'Name of taxpayer',
          secondaryNameLabel: 'Name of conservator',
        },
      };
      break;
    case PARTY_TYPES.corporation:
      contacts = {
        contactPrimary: {
          displayInCareOf: true,
          header: 'Corporation Information',
          inCareOfLabel: 'In care of',
          nameLabel: 'Business name',
        },
      };
      break;
    case PARTY_TYPES.custodian:
      contacts = {
        contactPrimary: {
          displaySecondaryName: true,
          header: 'Custodian Information',
          nameLabel: 'Name of taxpayer',
          secondaryNameLabel: 'Name of custodian',
        },
      };
      break;
    case PARTY_TYPES.donor:
      contacts = {
        contactPrimary: {
          header: 'Donor Information',
          nameLabel: 'Name of petitioner',
        },
      };
      break;
    case PARTY_TYPES.estate:
      contacts = {
        contactPrimary: {
          displaySecondaryName: true,
          displayTitle: true,
          header: 'Executor/Personal Representative/Etc.',
          nameLabel: 'Name of decedent',
          secondaryNameLabel: 'Name of executor/personal representative, etc.',
          titleHint: 'optional',
        },
      };
      break;
    case PARTY_TYPES.estateWithoutExecutor:
      contacts = {
        contactPrimary: {
          displayInCareOf: true,
          header: 'Estate Information',
          inCareOfLabel: 'In care of',
          inCareOfLabelHint: 'optional',
          nameLabel: 'Name of decedent',
        },
      };
      break;
    case PARTY_TYPES.guardian:
      contacts = {
        contactPrimary: {
          displaySecondaryName: true,
          header: 'Guardian Information',
          nameLabel: 'Name of taxpayer',
          secondaryNameLabel: 'Name of guardian',
        },
      };
      break;
    case PARTY_TYPES.nextFriendForIncompetentPerson:
      contacts = {
        contactPrimary: {
          displaySecondaryName: true,
          header: 'Next Friend Information',
          nameLabel: 'Name of legally incompetent person',
          secondaryNameLabel: 'Name of next friend',
        },
      };
      break;
    case PARTY_TYPES.nextFriendForMinor:
      contacts = {
        contactPrimary: {
          displaySecondaryName: true,
          header: 'Next Friend Information',
          nameLabel: 'Name of minor',
          secondaryNameLabel: 'Name of next friend',
        },
      };
      break;
    case PARTY_TYPES.partnershipBBA:
      contacts = {
        contactPrimary: {
          displaySecondaryName: true,
          header: 'Partnership Representative',
          nameLabel: 'Business name',
          secondaryNameLabel: 'Name of partnership representative',
        },
      };
      break;
    case PARTY_TYPES.partnershipOtherThanTaxMatters:
      contacts = {
        contactPrimary: {
          displaySecondaryName: true,
          header: 'Partnership (Other than Tax Matters Partner) Information',
          nameLabel: 'Business name',
          secondaryNameLabel: 'Name of partner (other than TMP)',
        },
      };
      break;
    case PARTY_TYPES.partnershipAsTaxMattersPartner:
      contacts = {
        contactPrimary: {
          displaySecondaryName: true,
          header: 'Tax Matters Partner Information',
          nameLabel: 'Business name',
          secondaryNameLabel: 'Name of Tax Matters Partner',
        },
      };
      break;
    case PARTY_TYPES.petitioner:
      contacts = {
        contactPrimary: {
          header: 'Petitioner Information',
          nameLabel: 'Name',
        },
      };
      break;
    case PARTY_TYPES.petitionerSpouse:
      contacts = {
        contactPrimary: {
          displayPhone: true,
          header: 'Petitioner Information',
          nameLabel: 'Name',
        },
        contactSecondary: {
          displayPhone: true,
          header: 'Spouse Information',
          nameLabel: 'Spouse’s name',
        },
      };
      break;
    case PARTY_TYPES.petitionerDeceasedSpouse:
      contacts = {
        contactPrimary: {
          header: 'Petitioner Information',
          nameLabel: 'Name of petitioner/surviving spouse',
        },
        contactSecondary: {
          displayInCareOf: true,
          displayPhone: true,
          header: 'Deceased Spouse Information',
          inCareOfLabel: 'In care of',
          nameLabel: 'Name of deceased spouse',
        },
      };
      break;
    case PARTY_TYPES.survivingSpouse:
      contacts = {
        contactPrimary: {
          displaySecondaryName: true,
          header: 'Petitioner Information',
          nameLabel: 'Name of deceased spouse',
          secondaryNameLabel: 'Name of surviving spouse',
        },
      };
      break;
    case PARTY_TYPES.transferee:
      contacts = {
        contactPrimary: {
          header: 'Transferee Information',
          nameLabel: 'Name of petitioner',
        },
      };
      break;
    case PARTY_TYPES.trust:
      contacts = {
        contactPrimary: {
          displaySecondaryName: true,
          header: 'Trustee Information',
          nameLabel: 'Name of trust',
          secondaryNameLabel: 'Name of trustee',
        },
      };
      break;
  }

  ['contactPrimary', 'contactSecondary'].forEach(contactLabel => {
    if (contacts[contactLabel]) {
      contacts[contactLabel].phoneNumberLabelHint = 'optional';
    }
  });

  return contacts;
};

/**
 * gets the contact view options based on partyType
 *
 * @param {Function} get the cerebral get function used
 * @param {object} applicationContext the application context
 * for getting state.caseDetail.partyType and state.constants
 * @returns {object} the contactPrimary and/or contactSecondary
 * view options
 */
export const caseDetailEditContactsHelper = (get, applicationContext) => {
  const partyType = get(state.form.partyType);
  const { PARTY_TYPES } = applicationContext.getConstants();

  const contacts = getOptionsForContact({ PARTY_TYPES, partyType });

  return contacts;
};
