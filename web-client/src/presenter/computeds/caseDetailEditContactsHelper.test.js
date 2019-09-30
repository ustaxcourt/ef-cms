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
        displaySecondaryName: true,
        header: 'Conservator Information',
        nameLabel: 'Name of Taxpayer',
        secondaryNameLabel: 'Name of Conservator',
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
        displaySecondaryName: true,
        header: 'Custodian Information',
        nameLabel: 'Name of Taxpayer',
        secondaryNameLabel: 'Name of Custodian',
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
        displaySecondaryName: true,
        displayTitle: true,
        header: 'Executor/Personal Representative/Etc.',
        nameLabel: 'Name of Decedent',
        secondaryNameLabel: 'Name of Executor/Personal Representative, etc.',
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
        displaySecondaryName: true,
        header: 'Guardian Information',
        nameLabel: 'Name of Taxpayer',
        secondaryNameLabel: 'Name of Guardian',
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
        displaySecondaryName: true,
        header: 'Next Friend Information',
        nameLabel: 'Name of Legally Incompetent Person',
        secondaryNameLabel: 'Name of Next Friend',
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
        displaySecondaryName: true,
        header: 'Next Friend Information',
        nameLabel: 'Name of Minor',
        secondaryNameLabel: 'Name of Next Friend',
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
        displaySecondaryName: true,
        header: 'Partnership Representative',
        nameLabel: 'Business Name',
        secondaryNameLabel: 'Name of Partnership Representative',
      },
    });
  });

  it('should validate form view information for party type Partnership (as a partner other than Tax Matters Partner)', () => {
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
        displaySecondaryName: true,
        header: 'Partnership (Other than Tax Matters Partner) Information',
        nameLabel: 'Business Name',
        secondaryNameLabel: 'Name of Partner (Other than TMP)',
      },
    });
  });

  it('should validate form view information for party type Partnership (as the Tax Matters Partner)', () => {
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
        displaySecondaryName: true,
        header: 'Tax Matters Partner Information',
        nameLabel: 'Business Name',
        secondaryNameLabel: 'Name of Tax Matters Partner',
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
        phoneNumberLabelHint: 'optional',
      },
      contactSecondary: {
        displayPhone: true,
        header: 'Spouse Information',
        nameLabel: "Spouse's Name",
        phoneNumberLabelHint: 'optional',
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
        nameLabel: 'Name of petitioner/surviving spouse',
      },
      contactSecondary: {
        header: 'Deceased Spouse Information',
        nameLabel: 'Name of Deceased Spouse',
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
        displaySecondaryName: true,
        header: 'Petitioner Information',
        nameLabel: 'Name of Deceased Spouse',
        secondaryNameLabel: 'Name of Surviving Spouse',
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
        displaySecondaryName: true,
        header: 'Trustee Information',
        nameLabel: 'Name of Trust',
        secondaryNameLabel: 'Name of Trustee',
      },
    });
  });
});
