import { state } from 'cerebral';

export const caseDetailEditContactsHelper = get => {
  const partyType = get(state.caseDetail.partyType);
  const { PARTY_TYPES } = get(state.constants);

  let contactPrimary, contactSecondary;
  switch (partyType) {
    case PARTY_TYPES.conservator:
      contactPrimary = {
        header: 'Conservator Information',
        nameLabel: 'Name of Conservator',
      };
      contactSecondary = {
        header: 'Taxpayer Information',
        nameLabel: 'Name of Taxpayer',
        displayInCareOf: true,
        displayPhone: true,
      };
      break;
    case PARTY_TYPES.corporation:
      contactPrimary = {
        header: 'Corporation Information',
        nameLabel: 'Business Name',
        inCareOfLabel: 'In Care Of',
        inCareOfLabelHint: 'Your Name',
        displayInCareOf: true,
      };
      break;
    case PARTY_TYPES.custodian:
      contactPrimary = {
        header: 'Custodian Information',
        nameLabel: 'Name of Custodian',
      };
      contactSecondary = {
        header: 'Taxpayer Information',
        nameLabel: 'Name of Taxpayer',
        displayInCareOf: true,
        displayPhone: true,
      };
      break;
    case PARTY_TYPES.donor:
      contactPrimary = {
        header: 'Donor Information',
        nameLabel: 'Name of Petitioner',
      };
      break;
    case PARTY_TYPES.estate:
      contactPrimary = {
        header: 'Executor/Personal Representative/Etc.',
        nameLabel: 'Name of Executor/Personal Representative, etc.',
        displayTitle: true,
      };
      contactSecondary = {
        header: 'Estate Information',
        nameLabel: 'Name of Decedent',
      };
      break;
    case PARTY_TYPES.estateWithoutExecutor:
      contactPrimary = {
        header: 'Estate Information',
        nameLabel: 'Name of Decedent',
        inCareOfLabel: 'In Care Of',
        inCareOfLabelHint: 'Your Name',
        displayInCareOf: true,
      };
      break;
    case PARTY_TYPES.guardian:
      contactPrimary = {
        header: 'Guardian Information',
        nameLabel: 'Name of Guardian',
      };
      contactSecondary = {
        header: 'Taxpayer Information',
        nameLabel: 'Name of Taxpayer',
        displayInCareOf: true,
        displayPhone: true,
      };
      break;
    case PARTY_TYPES.nextFriendForIncompetentPerson:
      contactPrimary = {
        header: 'Next Friend Information',
        nameLabel: 'Name of Next Friend',
      };
      contactSecondary = {
        header: 'Legally Incompetent Person Information',
        nameLabel: 'Name of Legally Incompetent Person',
        displayInCareOf: true,
        displayPhone: true,
      };
      break;
    case PARTY_TYPES.nextFriendForMinor:
      contactPrimary = {
        header: 'Next Friend Information',
        nameLabel: 'Name of Next Friend',
      };
      contactSecondary = {
        header: 'Minor Information',
        nameLabel: 'Name of Minor',
        displayInCareOf: true,
        displayPhone: true,
      };
      break;
    case PARTY_TYPES.partnershipBBA:
      contactPrimary = {
        header: 'Partnership Representative',
        nameLabel: 'Name of Partnership Representative',
      };
      contactSecondary = {
        header: 'Partnership Information',
        nameLabel: 'Business Name',
        displayInCareOf: true,
        displayPhone: true,
      };
      break;
    case PARTY_TYPES.partnershipOtherThanTaxMatters:
      contactPrimary = {
        header: 'Partnership (Other than Tax Matters Partner) Information',
        nameLabel: 'Name of Partner (Other than a Tax Matters Partner)',
      };
      contactSecondary = {
        header: 'Partnership Information',
        nameLabel: 'Business Name',
        displayInCareOf: true,
        displayPhone: true,
      };
      break;
    case PARTY_TYPES.partnershipAsTaxMattersPartner:
      contactPrimary = {
        header: 'Tax Matters Partner Information',
        nameLabel: 'Name of Tax Matters Partner',
      };
      contactSecondary = {
        header: 'Partnership Information',
        nameLabel: 'Business Name',
        displayInCareOf: true,
        displayPhone: true,
      };
      break;
    case PARTY_TYPES.petitioner:
      contactPrimary = {
        header: 'Petitioner Information',
        nameLabel: 'Name',
      };
      break;
    case PARTY_TYPES.petitionerSpouse:
      contactPrimary = {
        header: 'Petitioner Information',
        nameLabel: 'Name',
        displayPhone: true,
      };
      contactSecondary = {
        header: 'Spouse Information',
        nameLabel: "Spouse's Name",
        displayPhone: true,
      };
      break;
    case PARTY_TYPES.petitionerDeceasedSpouse:
      contactPrimary = {
        header: 'Petitioner Information',
        nameLabel: 'Name',
      };
      contactSecondary = {
        header: 'Spouse Information',
        nameLabel: "Spouse's Name",
      };
      break;
    case PARTY_TYPES.survivingSpouse:
      contactPrimary = {
        header: 'Petitioner Information',
        nameLabel: 'Name',
      };
      contactSecondary = {
        header: 'Spouse Information',
        nameLabel: "Spouse's Name",
      };
      break;
    case PARTY_TYPES.transferee:
      contactPrimary = {
        header: 'Transferee Information',
        nameLabel: 'Name of Petitioner',
      };
      break;
    case PARTY_TYPES.trust:
      contactPrimary = {
        header: 'Trustee Information',
        nameLabel: 'Name of Trustee',
      };
      contactSecondary = {
        header: 'Trust Information',
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
