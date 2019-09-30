import { runCompute } from 'cerebral/test';

import { ContactFactory } from '../../../../shared/src/business/entities/contacts/ContactFactory';
import { contactsHelper } from './contactsHelper';

describe('contactsHelper', () => {
  it('should validate form view information for party type Conservator and user role petitioner', () => {
    const result = runCompute(contactsHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: { partyType: ContactFactory.PARTY_TYPES.conservator },
        user: {
          role: 'petitioner',
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        displaySecondaryName: true,
        header: 'Tell Us About Yourself as the Conservator for This Taxpayer',
        nameLabel: 'Name of taxpayer',
        secondaryNameLabel: 'Name of conservator',
      },
    });
  });

  it('should validate form view information for party type Corporation and user role petitioner', () => {
    const result = runCompute(contactsHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: { partyType: ContactFactory.PARTY_TYPES.corporation },
        user: {
          role: 'petitioner',
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        displayInCareOf: true,
        header: 'Tell Us About the Corporation You Are Filing For',
        nameLabel: 'Business name',
      },
    });
  });

  it('should validate form view information for party type Custodian and user role petitioner', () => {
    const result = runCompute(contactsHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: { partyType: ContactFactory.PARTY_TYPES.custodian },
        user: {
          role: 'petitioner',
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        displaySecondaryName: true,
        header: 'Tell Us About Yourself as the Custodian for This Taxpayer',
        nameLabel: 'Name of taxpayer',
        secondaryNameLabel: 'Name of Custodian',
      },
    });
  });

  it('should validate form view information for party type Donor and user role petitioner', () => {
    const result = runCompute(contactsHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: { partyType: ContactFactory.PARTY_TYPES.donor },
        user: {
          role: 'petitioner',
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        header: 'Tell Us About the Donor You Are Filing For',
        nameLabel: 'Name of petitioner',
      },
    });
  });

  it('should validate form view information for party type Estate with an Executor/Personal Representative/Fiduciary/etc. and user role petitioner', () => {
    const result = runCompute(contactsHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.estate,
        },
        user: {
          role: 'petitioner',
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        displaySecondaryName: true,
        displayTitle: true,
        header:
          'Tell Us About Yourself as the Executor/Personal Representative/etc. For This Estate',
        nameLabel: 'Name of Decedent',
        secondaryNameLabel: 'Name of Executor/Personal Representative, etc.',
      },
    });
  });

  it('should validate form view information for party type Estate without an Executor/Personal Representative/Fiduciary/etc. and user role petitioner', () => {
    const result = runCompute(contactsHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.estateWithoutExecutor,
        },
        user: {
          role: 'petitioner',
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        displayInCareOf: true,
        header: 'Tell Us About the Estate You Are Filing For',
        nameLabel: 'Name of Decedent',
      },
    });
  });

  it('should validate form view information for party type Guardian and user role petitioner', () => {
    const result = runCompute(contactsHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.guardian,
        },
        user: {
          role: 'petitioner',
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        displaySecondaryName: true,
        header: 'Tell Us About Yourself as the Guardian for This Taxpayer',
        nameLabel: 'Name of taxpayer',
        secondaryNameLabel: 'Name of guardian',
      },
    });
  });

  it('should validate form view information for party type Next Friend for a Legally Incompetent Person (Without a Guardian, Conservator, or other like Fiduciary) and user role petitioner', () => {
    const result = runCompute(contactsHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.nextFriendForIncompetentPerson,
        },
        user: {
          role: 'petitioner',
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        displaySecondaryName: true,
        header:
          'Tell Us About Yourself as the Next Friend for This Legally Incompetent Person',
        nameLabel: 'Name of legally incompetent person',
        secondaryNameLabel: 'Name of next friend',
      },
    });
  });

  it('should validate form view information for party type Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary) and user role petitioner', () => {
    const result = runCompute(contactsHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.nextFriendForMinor,
        },
        user: {
          role: 'petitioner',
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        displaySecondaryName: true,
        header: 'Tell Us About Yourself as the Next Friend for This Minor',
        nameLabel: 'Name of minor',
        secondaryNameLabel: 'Name of next friend',
      },
    });
  });

  it('should validate form view information for party type Partnership (as a partnership representative under the BBA regime) and user role petitioner', () => {
    const result = runCompute(contactsHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.partnershipBBA,
        },
        user: {
          role: 'petitioner',
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        displaySecondaryName: true,
        header: 'Tell Us About Yourself as the Partnership Representative',
        nameLabel: 'Business name',
        secondaryNameLabel: 'Partnership representative name',
      },
    });
  });

  it('should validate form view information for party type Partnership (as a partner other than Tax Matters Partner) and user role petitioner', () => {
    const result = runCompute(contactsHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.partnershipOtherThanTaxMatters,
        },
        user: {
          role: 'petitioner',
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        displaySecondaryName: true,
        header:
          'Tell Us About Yourself as the Partner (Other than Tax Matters Partner)',
        nameLabel: 'Business name',
        secondaryNameLabel: 'Name of partner (other than TMP)',
      },
    });
  });

  it('should validate form view information for party type Partnership (as the Tax Matters Partner) and user role petitioner', () => {
    const result = runCompute(contactsHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.partnershipAsTaxMattersPartner,
        },
        user: {
          role: 'petitioner',
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        displaySecondaryName: true,
        header: 'Tell Us About Yourself as the Tax Matters Partner',
        nameLabel: 'Partnership Name',
        secondaryNameLabel: 'Tax Matters Partner name',
      },
    });
  });

  it('should validate form view information for party type Petitioner and user role petitioner', () => {
    const result = runCompute(contactsHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.petitioner,
        },
        user: {
          role: 'petitioner',
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

  it('should validate form view information for party type Petitioner & Spouse and user role petitioner', () => {
    const result = runCompute(contactsHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.petitionerSpouse,
        },
        user: {
          role: 'petitioner',
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        displayPhone: true,
        header: 'Tell Us About Yourself',
        nameLabel: 'Name',
      },
      contactSecondary: {
        displayPhone: true,
        header: 'Tell Us About Your Spouse',
        nameLabel: "Spouse's name",
      },
    });
  });

  it('should validate form view information for party type Petitioner & Deceased Spouse and user role petitioner', () => {
    const result = runCompute(contactsHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.petitionerDeceasedSpouse,
        },
        user: {
          role: 'petitioner',
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        header: 'Tell Us About Yourself',
        nameLabel: 'Name of petitioner/surviving spouse',
      },
      contactSecondary: {
        header: 'Tell Us About Your Deceased Spouse',
        nameLabel: 'Name of deceased spouse',
      },
    });
  });

  it('should validate form view information for party type Surviving Spouse and user role petitioner', () => {
    const result = runCompute(contactsHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.survivingSpouse,
        },
        user: {
          role: 'petitioner',
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        displaySecondaryName: true,
        header: 'Tell Us About Yourself as the Surviving Spouse',
        nameLabel: 'Name of deceased spouse',
        secondaryNameLabel: 'Name of surviving spouse',
      },
    });
  });

  it('should validate form view information for party type Transferee and user role petitioner', () => {
    const result = runCompute(contactsHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.transferee,
        },
        user: {
          role: 'petitioner',
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        header: 'Tell Us About the Transferee You Are Filing For',
        nameLabel: 'Name of petitioner',
      },
    });
  });

  it('should validate form view information for party type Trust and user role petitioner', () => {
    const result = runCompute(contactsHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.trust,
        },
        user: {
          role: 'petitioner',
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        displaySecondaryName: true,
        header: 'Tell Us About Yourself as the Trustee',
        nameLabel: 'Name of trust',
        secondaryNameLabel: 'Name of trustee',
      },
    });
  });

  it('should validate form view information for party type Conservator and user role practitioner', () => {
    const result = runCompute(contactsHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: { partyType: ContactFactory.PARTY_TYPES.conservator },
        user: {
          role: 'practitioner',
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        displaySecondaryName: true,
        header: 'Tell Us About the Conservator for This Taxpayer',
        nameLabel: 'Name of taxpayer',
        secondaryNameLabel: 'Name of conservator',
      },
    });
  });

  it('should validate form view information for party type Corporation and user role practitioner', () => {
    const result = runCompute(contactsHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: { partyType: ContactFactory.PARTY_TYPES.corporation },
        user: {
          role: 'practitioner',
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        displayInCareOf: true,
        header: 'Tell Us About the Corporation You Are Filing For',
        nameLabel: 'Business name',
      },
    });
  });

  it('should validate form view information for party type Custodian and user role practitioner', () => {
    const result = runCompute(contactsHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: { partyType: ContactFactory.PARTY_TYPES.custodian },
        user: {
          role: 'practitioner',
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        displaySecondaryName: true,
        header: 'Tell Us About the Custodian for This Taxpayer',
        nameLabel: 'Name of taxpayer',
        secondaryNameLabel: 'Name of Custodian',
      },
    });
  });

  it('should validate form view information for party type Donor and user role practitioner', () => {
    const result = runCompute(contactsHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: { partyType: ContactFactory.PARTY_TYPES.donor },
        user: {
          role: 'practitioner',
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        header: 'Tell Us About the Donor You Are Filing For',
        nameLabel: 'Name of petitioner',
      },
    });
  });

  it('should validate form view information for party type Estate with an Executor/Personal Representative/Fiduciary/etc. and user role practitioner', () => {
    const result = runCompute(contactsHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.estate,
        },
        user: {
          role: 'practitioner',
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        displaySecondaryName: true,
        displayTitle: true,
        header:
          'Tell Us About the Executor/Personal Representative/etc. For This Estate',
        nameLabel: 'Name of Decedent',
        secondaryNameLabel: 'Name of Executor/Personal Representative, etc.',
      },
    });
  });

  it('should validate form view information for party type Estate without an Executor/Personal Representative/Fiduciary/etc. and user role practitioner', () => {
    const result = runCompute(contactsHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.estateWithoutExecutor,
        },
        user: {
          role: 'practitioner',
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        displayInCareOf: true,
        header: 'Tell Us About the Estate You Are Filing For',
        nameLabel: 'Name of Decedent',
      },
    });
  });

  it('should validate form view information for party type Guardian and user role practitioner', () => {
    const result = runCompute(contactsHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.guardian,
        },
        user: {
          role: 'practitioner',
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        displaySecondaryName: true,
        header: 'Tell Us About the Guardian for This Taxpayer',
        nameLabel: 'Name of taxpayer',
        secondaryNameLabel: 'Name of guardian',
      },
    });
  });

  it('should validate form view information for party type Next Friend for a Legally Incompetent Person (Without a Guardian, Conservator, or other like Fiduciary) and user role practitioner', () => {
    const result = runCompute(contactsHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.nextFriendForIncompetentPerson,
        },
        user: {
          role: 'practitioner',
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        displaySecondaryName: true,
        header:
          'Tell Us About the Next Friend for This Legally Incompetent Person',
        nameLabel: 'Name of legally incompetent person',
        secondaryNameLabel: 'Name of next friend',
      },
    });
  });

  it('should validate form view information for party type Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary) and user role practitioner', () => {
    const result = runCompute(contactsHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.nextFriendForMinor,
        },
        user: {
          role: 'practitioner',
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        displaySecondaryName: true,
        header: 'Tell Us About the Next Friend for This Minor',
        nameLabel: 'Name of minor',
        secondaryNameLabel: 'Name of next friend',
      },
    });
  });

  it('should validate form view information for party type Partnership (as a partnership representative under the BBA regime) and user role practitioner', () => {
    const result = runCompute(contactsHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.partnershipBBA,
        },
        user: {
          role: 'practitioner',
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        displaySecondaryName: true,
        header: 'Tell Us About the Partnership Representative',
        nameLabel: 'Business name',
        secondaryNameLabel: 'Name of partnership representative',
      },
    });
  });

  it('should validate form view information for party type Partnership (as a partner other than Tax Matters Partner) and user role practitioner', () => {
    const result = runCompute(contactsHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.partnershipOtherThanTaxMatters,
        },
        user: {
          role: 'practitioner',
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        displaySecondaryName: true,
        header: 'Tell Us About the Partner (Other than Tax Matters Partner)',
        nameLabel: 'Business name',
        secondaryNameLabel: 'Name of partner (other than TMP)',
      },
    });
  });

  it('should validate form view information for party type Partnership (as the Tax Matters Partner) and user role practitioner', () => {
    const result = runCompute(contactsHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.partnershipAsTaxMattersPartner,
        },
        user: {
          role: 'practitioner',
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        displaySecondaryName: true,
        header: 'Tell Us About the Tax Matters Partner',
        nameLabel: 'Name of Partnership',
        secondaryNameLabel: 'Name of Tax Matters Partner',
      },
    });
  });

  it('should validate form view information for party type Petitioner and user role practitioner', () => {
    const result = runCompute(contactsHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.petitioner,
        },
        user: {
          role: 'practitioner',
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        header: 'Tell Us About the Petitioner',
        nameLabel: 'Name',
      },
    });
  });

  it('should validate form view information for party type Petitioner & Spouse and user role practitioner', () => {
    const result = runCompute(contactsHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.petitionerSpouse,
        },
        user: {
          role: 'practitioner',
        },
      },
    });
    expect(result).toMatchObject({
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
    });
  });

  it('should validate form view information for party type Petitioner & Deceased Spouse and user role practitioner', () => {
    const result = runCompute(contactsHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.petitionerDeceasedSpouse,
        },
        user: {
          role: 'practitioner',
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        header: 'Tell Us About the Petitioner',
        nameLabel: 'Name',
      },
      contactSecondary: {
        header: 'Tell Us About the Deceased Petitioner',
        nameLabel: 'Deceased Petitioner Name',
      },
    });
  });

  it('should validate form view information for party type Surviving Spouse and user role practitioner', () => {
    const result = runCompute(contactsHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.survivingSpouse,
        },
        user: {
          role: 'practitioner',
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        displaySecondaryName: true,
        header: 'Tell Us About the Surviving Spouse',
        nameLabel: 'Name of deceased spouse',
        secondaryNameLabel: 'Name of surviving spouse',
      },
    });
  });

  it('should validate form view information for party type Transferee and user role practitioner', () => {
    const result = runCompute(contactsHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.transferee,
        },
        user: {
          role: 'practitioner',
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        header: 'Tell Us About the Transferee You Are Filing For',
        nameLabel: 'Name of petitioner',
      },
    });
  });

  it('should validate form view information for party type Trust and user role practitioner', () => {
    const result = runCompute(contactsHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.trust,
        },
        user: {
          role: 'practitioner',
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        displaySecondaryName: true,
        header: 'Tell Us About the Trustee',
        nameLabel: 'Name of trust',
        secondaryNameLabel: 'Name of trustee',
      },
    });
  });
});
