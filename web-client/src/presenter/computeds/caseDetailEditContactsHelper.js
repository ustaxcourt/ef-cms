import { state } from 'cerebral';

/**
 * updates the partyType, filingType, otherType, businessType,
 * contactPrimary, and/or contactSecondary depending on the
 * key/value pair passed in via props
 *
 * @param {Function} get the cerebral get function used
 * for getting state.caseDetail.partyType and state.constants
 * @returns {Object} the contactPrimary and/or contactSecondary
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
          header: 'Taxpayer Information',
          nameLabel: 'Name of Taxpayer',
          displayInCareOf: true,
          displayPhone: true,
        },
      };
      break;
    case PARTY_TYPES.corporation:
      contacts = {
        contactPrimary: {
          header: 'Corporation Information',
          nameLabel: 'Business Name',
          inCareOfLabel: 'In Care Of',
          inCareOfLabelHint: 'Your Name',
          displayInCareOf: true,
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
          header: 'Taxpayer Information',
          nameLabel: 'Name of Taxpayer',
          displayInCareOf: true,
          displayPhone: true,
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
          header: 'Executor/Personal Representative/Etc.',
          nameLabel: 'Name of Executor/Personal Representative, etc.',
          displayTitle: true,
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
          header: 'Estate Information',
          nameLabel: 'Name of Decedent',
          inCareOfLabel: 'In Care Of',
          inCareOfLabelHint: 'Your Name',
          displayInCareOf: true,
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
          header: 'Taxpayer Information',
          nameLabel: 'Name of Taxpayer',
          displayInCareOf: true,
          displayPhone: true,
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
          header: 'Legally Incompetent Person Information',
          nameLabel: 'Name of Legally Incompetent Person',
          displayInCareOf: true,
          displayPhone: true,
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
          header: 'Minor Information',
          nameLabel: 'Name of Minor',
          displayInCareOf: true,
          displayPhone: true,
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
          header: 'Partnership Information',
          nameLabel: 'Business Name',
          displayInCareOf: true,
          displayPhone: true,
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
          header: 'Partnership Information',
          nameLabel: 'Business Name',
          displayInCareOf: true,
          displayPhone: true,
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
          header: 'Partnership Information',
          nameLabel: 'Business Name',
          displayInCareOf: true,
          displayPhone: true,
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
          header: 'Petitioner Information',
          nameLabel: 'Name',
          displayPhone: true,
        },
        contactSecondary: {
          header: 'Spouse Information',
          nameLabel: "Spouse's Name",
          displayPhone: true,
        },
      };
      break;
    case PARTY_TYPES.petitionerDeceasedSpouse:
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
          header: 'Trust Information',
          nameLabel: 'Name of Trust',
          displayInCareOf: true,
          displayPhone: true,
        },
      };
      break;
  }

  return contacts;
};
