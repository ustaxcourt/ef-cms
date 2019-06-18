import { state } from 'cerebral';

/**
 * gets the contact view options based on partyType
 *
 * @param {Function} get the cerebral get function used
 * for getting state.caseDetail.partyType and state.constants
 * @returns {object} the contactPrimary and/or contactSecondary
 * view options
 */
export const caseDetailEditContactsHelper = get => {
  const partyType = get(state.caseDetail.partyType);
  const { PARTY_TYPES } = get(state.constants);

  let contacts;
  switch (partyType) {
    case PARTY_TYPES.conservator:
      contacts = {
        contactPrimary: {
          header: 'Conservator Information',
          nameLabel: 'Name of Conservator',
        },
        contactSecondary: {
          displayInCareOf: true,
          displayPhone: true,
          header: 'Taxpayer Information',
          nameLabel: 'Name of Taxpayer',
        },
      };
      break;
    case PARTY_TYPES.corporation:
      contacts = {
        contactPrimary: {
          displayInCareOf: true,
          header: 'Corporation Information',
          inCareOfLabel: 'In Care Of',
          inCareOfLabelHint: 'Your Name',
          nameLabel: 'Business Name',
        },
      };
      break;
    case PARTY_TYPES.custodian:
      contacts = {
        contactPrimary: {
          header: 'Custodian Information',
          nameLabel: 'Name of Custodian',
        },
        contactSecondary: {
          displayInCareOf: true,
          displayPhone: true,
          header: 'Taxpayer Information',
          nameLabel: 'Name of Taxpayer',
        },
      };
      break;
    case PARTY_TYPES.donor:
      contacts = {
        contactPrimary: {
          header: 'Donor Information',
          nameLabel: 'Name of Petitioner',
        },
      };
      break;
    case PARTY_TYPES.estate:
      contacts = {
        contactPrimary: {
          displayTitle: true,
          header: 'Executor/Personal Representative/Etc.',
          nameLabel: 'Name of Executor/Personal Representative, etc.',
        },
        contactSecondary: {
          header: 'Estate Information',
          nameLabel: 'Name of Decedent',
        },
      };
      break;
    case PARTY_TYPES.estateWithoutExecutor:
      contacts = {
        contactPrimary: {
          displayInCareOf: true,
          header: 'Estate Information',
          inCareOfLabel: 'In Care Of',
          inCareOfLabelHint: 'Your Name',
          nameLabel: 'Name of Decedent',
        },
      };
      break;
    case PARTY_TYPES.guardian:
      contacts = {
        contactPrimary: {
          header: 'Guardian Information',
          nameLabel: 'Name of Guardian',
        },
        contactSecondary: {
          displayInCareOf: true,
          displayPhone: true,
          header: 'Taxpayer Information',
          nameLabel: 'Name of Taxpayer',
        },
      };
      break;
    case PARTY_TYPES.nextFriendForIncompetentPerson:
      contacts = {
        contactPrimary: {
          header: 'Next Friend Information',
          nameLabel: 'Name of Next Friend',
        },
        contactSecondary: {
          displayInCareOf: true,
          displayPhone: true,
          header: 'Legally Incompetent Person Information',
          nameLabel: 'Name of Legally Incompetent Person',
        },
      };
      break;
    case PARTY_TYPES.nextFriendForMinor:
      contacts = {
        contactPrimary: {
          header: 'Next Friend Information',
          nameLabel: 'Name of Next Friend',
        },
        contactSecondary: {
          displayInCareOf: true,
          displayPhone: true,
          header: 'Minor Information',
          nameLabel: 'Name of Minor',
        },
      };
      break;
    case PARTY_TYPES.partnershipBBA:
      contacts = {
        contactPrimary: {
          header: 'Partnership Representative',
          nameLabel: 'Name of Partnership Representative',
        },
        contactSecondary: {
          displayInCareOf: true,
          displayPhone: true,
          header: 'Partnership Information',
          nameLabel: 'Business Name',
        },
      };
      break;
    case PARTY_TYPES.partnershipOtherThanTaxMatters:
      contacts = {
        contactPrimary: {
          header: 'Partnership (Other than Tax Matters Partner) Information',
          nameLabel: 'Name of Partner (Other than a Tax Matters Partner)',
        },
        contactSecondary: {
          displayInCareOf: true,
          displayPhone: true,
          header: 'Partnership Information',
          nameLabel: 'Business Name',
        },
      };
      break;
    case PARTY_TYPES.partnershipAsTaxMattersPartner:
      contacts = {
        contactPrimary: {
          header: 'Tax Matters Partner Information',
          nameLabel: 'Name of Tax Matters Partner',
        },
        contactSecondary: {
          displayInCareOf: true,
          displayPhone: true,
          header: 'Partnership Information',
          nameLabel: 'Business Name',
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
          nameLabel: "Spouse's Name",
        },
      };
      break;
    case PARTY_TYPES.petitionerDeceasedSpouse:
    case PARTY_TYPES.survivingSpouse:
      contacts = {
        contactPrimary: {
          header: 'Petitioner Information',
          nameLabel: 'Name',
        },
        contactSecondary: {
          header: 'Spouse Information',
          nameLabel: "Spouse's Name",
        },
      };
      break;
    case PARTY_TYPES.transferee:
      contacts = {
        contactPrimary: {
          header: 'Transferee Information',
          nameLabel: 'Name of Petitioner',
        },
      };
      break;
    case PARTY_TYPES.trust:
      contacts = {
        contactPrimary: {
          header: 'Trustee Information',
          nameLabel: 'Name of Trustee',
        },
        contactSecondary: {
          displayInCareOf: true,
          displayPhone: true,
          header: 'Trust Information',
          nameLabel: 'Name of Trust',
        },
      };
      break;
  }

  return contacts;
};
