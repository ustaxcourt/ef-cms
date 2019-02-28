import { runCompute } from 'cerebral/test';

import { contactsHelper } from './contactsHelper';
import { PARTY_TYPES } from '../../../../shared/src/business/entities/Contacts/PetitionContact';

describe('contactsHelper', () => {
  it('should validate form view information for party type Conservator', async () => {
    const result = await runCompute(contactsHelper, {
      state: {
        form: { partyType: PARTY_TYPES.conservator },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        header: 'Tell Us About Yourself as the Conservator for This Taxpayer',
        nameLabel: 'Name of Conservator',
      },
      contactSecondary: {
        header: 'Tell Us About the Taxpayer You Are Filing For',
        nameLabel: 'Name of Taxpayer',
        displayInCareOf: true,
        displayPhone: true,
      },
    });
  });

  it('should validate form view information for party type Corporation', async () => {
    const result = await runCompute(contactsHelper, {
      state: {
        form: { partyType: PARTY_TYPES.corporation },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        header: 'Tell Us About the Corporation You Are Filing For',
        nameLabel: 'Business Name',
        displayInCareOf: true,
      },
    });
  });

  it('should validate form view information for party type Custodian', async () => {
    const result = await runCompute(contactsHelper, {
      state: {
        form: { partyType: PARTY_TYPES.custodian },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        header: 'Tell Us About Yourself as the Custodian for This Taxpayer',
        nameLabel: 'Name of Custodian',
      },
      contactSecondary: {
        header: 'Tell Us About the Taxpayer You Are Filing For',
        nameLabel: 'Name of Taxpayer',
        displayInCareOf: true,
        displayPhone: true,
      },
    });
  });

  it('should validate form view information for party type Donor', async () => {
    const result = await runCompute(contactsHelper, {
      state: {
        form: { partyType: PARTY_TYPES.donor },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        header: 'Tell Us About the Donor You Are Filing For',
        nameLabel: 'Name of Petitioner',
      },
    });
  });

  it('should validate form view information for party type Estate with an Executor/Personal Representative/Fiduciary/etc.', async () => {
    const result = await runCompute(contactsHelper, {
      state: {
        form: {
          partyType: PARTY_TYPES.estate,
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        header:
          'Tell Us About Yourself as the Executor/Personal Representative/etc. For This Estate',
        nameLabel: 'Name of Executor/Personal Representative, etc.',
        displayTitle: true,
      },
      contactSecondary: {
        header: 'Tell Us About the Estate You Are Filing For',
        nameLabel: 'Name of Decedent',
      },
    });
  });

  it('should validate form view information for party type Estate without an Executor/Personal Representative/Fiduciary/etc.', async () => {
    const result = await runCompute(contactsHelper, {
      state: {
        form: {
          partyType: PARTY_TYPES.estateWithoutExecutor,
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        header: 'Tell Us About the Estate You Are Filing For',
        nameLabel: 'Name of Decedent',
        displayInCareOf: true,
      },
    });
  });

  it('should validate form view information for party type Guardian', async () => {
    const result = await runCompute(contactsHelper, {
      state: {
        form: {
          partyType: PARTY_TYPES.guardian,
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        header: 'Tell Us About Yourself as the Guardian for This Taxpayer',
        nameLabel: 'Name of Guardian',
      },
      contactSecondary: {
        header: 'Tell Us About the Taxpayer You Are Filing For',
        nameLabel: 'Name of Taxpayer',
        displayInCareOf: true,
        displayPhone: true,
      },
    });
  });

  it('should validate form view information for party type Next Friend for a Legally Incompetent Person (Without a Guardian, Conservator, or other like Fiduciary)', async () => {
    const result = await runCompute(contactsHelper, {
      state: {
        form: {
          partyType: PARTY_TYPES.nextFriendForIncompetentPerson,
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        header:
          'Tell Us About Yourself as the Next Friend for This Legally Incompetent Person',
        nameLabel: 'Name of Next Friend',
      },
      contactSecondary: {
        header:
          'Tell Us About the Legally Incompetent Person You Are Filing For',
        nameLabel: 'Name of Legally Incompetent Person',
        displayInCareOf: true,
        displayPhone: true,
      },
    });
  });

  it('should validate form view information for party type Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)', async () => {
    const result = await runCompute(contactsHelper, {
      state: {
        form: {
          partyType: PARTY_TYPES.nextFriendForMinor,
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        header: 'Tell Us About Yourself as the Next Friend for This Minor',
        nameLabel: 'Name of Next Friend',
      },
      contactSecondary: {
        header: 'Tell Us About the Minor You Are Filing For',
        nameLabel: 'Name of Minor',
        displayInCareOf: true,
        displayPhone: true,
      },
    });
  });

  it('should validate form view information for party type Partnership (as a partnership representative under the BBA regime)', async () => {
    const result = await runCompute(contactsHelper, {
      state: {
        form: {
          partyType: PARTY_TYPES.partnershipBBA,
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        header: 'Tell Us About Yourself as the Partnership Representative',
        nameLabel: 'Name of Partnership Representative',
      },
      contactSecondary: {
        header: 'Tell Us About the Partnership You Are Filing For',
        nameLabel: 'Business Name',
        displayInCareOf: true,
        displayPhone: true,
      },
    });
  });

  it('should validate form view information for party type Partnership (as a partner other than tax matters partner)', async () => {
    const result = await runCompute(contactsHelper, {
      state: {
        form: {
          partyType: PARTY_TYPES.partnershipOtherThanTaxMatters,
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        header:
          'Tell Us About Yourself as the Partner (Other than Tax Matters Partner)',
        nameLabel: 'Name of Partner (Other than a Tax Matters Partner)',
      },
      contactSecondary: {
        header: 'Tell Us About the Partnership You Are Filing For',
        nameLabel: 'Business Name',
        displayInCareOf: true,
        displayPhone: true,
      },
    });
  });

  it('should validate form view information for party type Partnership (as the tax matters partner)', async () => {
    const result = await runCompute(contactsHelper, {
      state: {
        form: {
          partyType: PARTY_TYPES.partnershipAsTaxMattersPartner,
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        header: 'Tell Us About Yourself as the Tax Matters Partner',
        nameLabel: 'Name of Tax Matters Partner',
      },
      contactSecondary: {
        header: 'Tell Us About the Partnership You Are Filing For',
        nameLabel: 'Business Name',
        displayInCareOf: true,
        displayPhone: true,
      },
    });
  });

  it('should validate form view information for party type Petitioner', async () => {
    const result = await runCompute(contactsHelper, {
      state: {
        form: {
          partyType: PARTY_TYPES.petitioner,
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        header: 'Tell Us About Yourself',
        nameLabel: 'Name',
      },
    });
  });

  it('should validate form view information for party type Petitioner & Spouse', async () => {
    const result = await runCompute(contactsHelper, {
      state: {
        form: {
          partyType: PARTY_TYPES.petitionerSpouse,
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        header: 'Tell Us About Yourself',
        nameLabel: 'Name',
        displayPhone: true,
      },
      contactSecondary: {
        header: 'Tell Us About Your Spouse',
        nameLabel: "Spouse's Name",
        displayPhone: true,
      },
    });
  });

  it('should validate form view information for party type Petitioner & Deceased Spouse', async () => {
    const result = await runCompute(contactsHelper, {
      state: {
        form: {
          partyType: PARTY_TYPES.petitionerDeceasedSpouse,
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        header: 'Tell Us About Yourself',
        nameLabel: 'Name',
      },
      contactSecondary: {
        header: 'Tell Us About Your Deceased Spouse',
        nameLabel: "Spouse's Name",
      },
    });
  });

  it('should validate form view information for party type Surviving Spouse', async () => {
    const result = await runCompute(contactsHelper, {
      state: {
        form: {
          partyType: PARTY_TYPES.survivingSpouse,
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        header: 'Tell Us About Yourself as the Surviving Spouse',
        nameLabel: 'Name',
      },
      contactSecondary: {
        header: 'Tell Us About Your Deceased Spouse',
        nameLabel: "Spouse's Name",
      },
    });
  });

  it('should validate form view information for party type Transferee', async () => {
    const result = await runCompute(contactsHelper, {
      state: {
        form: {
          partyType: PARTY_TYPES.transferee,
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        header: 'Tell Us About the Transferee You Are Filing For',
        nameLabel: 'Name of Petitioner',
      },
    });
  });

  it('should validate form view information for party type Trust', async () => {
    const result = await runCompute(contactsHelper, {
      state: {
        form: {
          partyType: PARTY_TYPES.trust,
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        header: 'Tell Us About Yourself as the Trustee',
        nameLabel: 'Name of Trustee',
      },
      contactSecondary: {
        header: 'Tell Us About the Trust You Are Filing For',
        nameLabel: 'Name of Trust',
        displayInCareOf: true,
        displayPhone: true,
      },
    });
  });
});
