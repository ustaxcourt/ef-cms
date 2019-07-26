import { runCompute } from 'cerebral/test';

import { ContactFactory } from '../../../../shared/src/business/entities/contacts/ContactFactory';
import { caseDetailEditContactsHelper } from './caseDetailEditContactsHelper';

describe('caseDetailEditContactsHelper', () => {
  it('should validate form view information for party type Conservator', () => {
    const result = runCompute(caseDetailEditContactsHelper, {
      state: {
        caseDetail: { partyType: ContactFactory.PARTY_TYPES.conservator },
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
      },
    });
    expect(result).toMatchObject({
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
    });
  });

  it('should validate form view information for party type Corporation', () => {
    const result = runCompute(caseDetailEditContactsHelper, {
      state: {
        caseDetail: { partyType: ContactFactory.PARTY_TYPES.corporation },
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        displayInCareOf: true,
        header: 'Corporation Information',
        nameLabel: 'Business Name',
      },
    });
  });

  it('should validate form view information for party type Custodian', () => {
    const result = runCompute(caseDetailEditContactsHelper, {
      state: {
        caseDetail: { partyType: ContactFactory.PARTY_TYPES.custodian },
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
      },
    });
    expect(result).toMatchObject({
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
    });
  });

  it('should validate form view information for party type Donor', () => {
    const result = runCompute(caseDetailEditContactsHelper, {
      state: {
        caseDetail: { partyType: ContactFactory.PARTY_TYPES.donor },
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        header: 'Donor Information',
        nameLabel: 'Name of Petitioner',
      },
    });
  });

  it('should validate form view information for party type Estate with an Executor/Personal Representative/Fiduciary/etc.', () => {
    const result = runCompute(caseDetailEditContactsHelper, {
      state: {
        caseDetail: {
          partyType: ContactFactory.PARTY_TYPES.estate,
        },
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        displayTitle: true,
        header: 'Executor/Personal Representative/Etc.',
        nameLabel: 'Name of Executor/Personal Representative, etc.',
      },
      contactSecondary: {
        header: 'Estate Information',
        nameLabel: 'Name of Decedent',
      },
    });
  });

  it('should validate form view information for party type Estate without an Executor/Personal Representative/Fiduciary/etc.', () => {
    const result = runCompute(caseDetailEditContactsHelper, {
      state: {
        caseDetail: {
          partyType: ContactFactory.PARTY_TYPES.estateWithoutExecutor,
        },
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        displayInCareOf: true,
        header: 'Estate Information',
        nameLabel: 'Name of Decedent',
      },
    });
  });

  it('should validate form view information for party type Guardian', () => {
    const result = runCompute(caseDetailEditContactsHelper, {
      state: {
        caseDetail: {
          partyType: ContactFactory.PARTY_TYPES.guardian,
        },
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
      },
    });
    expect(result).toMatchObject({
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
    });
  });

  it('should validate form view information for party type Next Friend for a Legally Incompetent Person (Without a Guardian, Conservator, or other like Fiduciary)', () => {
    const result = runCompute(caseDetailEditContactsHelper, {
      state: {
        caseDetail: {
          partyType: ContactFactory.PARTY_TYPES.nextFriendForIncompetentPerson,
        },
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
      },
    });
    expect(result).toMatchObject({
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
    });
  });

  it('should validate form view information for party type Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)', () => {
    const result = runCompute(caseDetailEditContactsHelper, {
      state: {
        caseDetail: {
          partyType: ContactFactory.PARTY_TYPES.nextFriendForMinor,
        },
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
      },
    });
    expect(result).toMatchObject({
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
    });
  });

  it('should validate form view information for party type Partnership (as a partnership representative under the BBA regime)', () => {
    const result = runCompute(caseDetailEditContactsHelper, {
      state: {
        caseDetail: {
          partyType: ContactFactory.PARTY_TYPES.partnershipBBA,
        },
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
      },
    });
    expect(result).toMatchObject({
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
    });
  });

  it('should validate form view information for party type Partnership (as a partner other than tax matters partner)', () => {
    const result = runCompute(caseDetailEditContactsHelper, {
      state: {
        caseDetail: {
          partyType: ContactFactory.PARTY_TYPES.partnershipOtherThanTaxMatters,
        },
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
      },
    });
    expect(result).toMatchObject({
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
    });
  });

  it('should validate form view information for party type Partnership (as the tax matters partner)', () => {
    const result = runCompute(caseDetailEditContactsHelper, {
      state: {
        caseDetail: {
          partyType: ContactFactory.PARTY_TYPES.partnershipAsTaxMattersPartner,
        },
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
      },
    });
    expect(result).toMatchObject({
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
    });
  });

  it('should validate form view information for party type Petitioner', () => {
    const result = runCompute(caseDetailEditContactsHelper, {
      state: {
        caseDetail: {
          partyType: ContactFactory.PARTY_TYPES.petitioner,
        },
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        header: 'Petitioner Information',
        nameLabel: 'Name',
      },
    });
  });

  it('should validate form view information for party type Petitioner & Spouse', () => {
    const result = runCompute(caseDetailEditContactsHelper, {
      state: {
        caseDetail: {
          partyType: ContactFactory.PARTY_TYPES.petitionerSpouse,
        },
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
      },
    });
    expect(result).toMatchObject({
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
    });
  });

  it('should validate form view information for party type Petitioner & Deceased Spouse', () => {
    const result = runCompute(caseDetailEditContactsHelper, {
      state: {
        caseDetail: {
          partyType: ContactFactory.PARTY_TYPES.petitionerDeceasedSpouse,
        },
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        header: 'Petitioner Information',
        nameLabel: 'Name',
      },
      contactSecondary: {
        header: 'Spouse Information',
        nameLabel: "Spouse's Name",
      },
    });
  });

  it('should validate form view information for party type Surviving Spouse', () => {
    const result = runCompute(caseDetailEditContactsHelper, {
      state: {
        caseDetail: {
          partyType: ContactFactory.PARTY_TYPES.survivingSpouse,
        },
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        header: 'Petitioner Information',
        nameLabel: 'Name',
      },
      contactSecondary: {
        header: 'Spouse Information',
        nameLabel: "Spouse's Name",
      },
    });
  });

  it('should validate form view information for party type Transferee', () => {
    const result = runCompute(caseDetailEditContactsHelper, {
      state: {
        caseDetail: {
          partyType: ContactFactory.PARTY_TYPES.transferee,
        },
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        header: 'Transferee Information',
        nameLabel: 'Name of Petitioner',
      },
    });
  });

  it('should validate form view information for party type Trust', () => {
    const result = runCompute(caseDetailEditContactsHelper, {
      state: {
        caseDetail: {
          partyType: ContactFactory.PARTY_TYPES.trust,
        },
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
      },
    });
    expect(result).toMatchObject({
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
    });
  });
});
