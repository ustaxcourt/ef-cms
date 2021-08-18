import { PARTY_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../applicationContext';
import { contactsHelper as contactsHelperComputed } from './contactsHelper';
import {
  petitionerUser,
  privatePractitionerUser,
} from '../../../../shared/src/test/mockUsers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const contactsHelper = withAppContextDecorator(
  contactsHelperComputed,
  applicationContext,
);

describe('contactsHelper', () => {
  describe('user role petitioner', () => {
    beforeAll(() => {
      applicationContext.getCurrentUser = () => petitionerUser;
    });

    it('should validate form view information for party type Conservator', () => {
      const result = runCompute(contactsHelper, {
        state: {
          form: { partyType: PARTY_TYPES.conservator },
        },
      });
      expect(result.contactPrimary).toMatchObject({
        displaySecondaryName: true,
        header: 'Tell Us About Yourself as the Conservator for This Taxpayer',
        nameLabel: 'Name of taxpayer',
        secondaryNameLabel: 'Name of conservator',
      });
    });

    it('should validate form view information for party type Corporation', () => {
      const result = runCompute(contactsHelper, {
        state: {
          form: { partyType: PARTY_TYPES.corporation },
        },
      });
      expect(result.contactPrimary).toMatchObject({
        displayInCareOf: true,
        header: 'Tell Us About the Corporation You Are Filing For',
        nameLabel: 'Business name',
      });
    });

    it('should validate form view information for party type Custodian', () => {
      const result = runCompute(contactsHelper, {
        state: {
          form: { partyType: PARTY_TYPES.custodian },
        },
      });
      expect(result.contactPrimary).toMatchObject({
        displaySecondaryName: true,
        header: 'Tell Us About Yourself as the Custodian for This Taxpayer',
        nameLabel: 'Name of taxpayer',
        secondaryNameLabel: 'Name of custodian',
      });
    });

    it('should validate form view information for party type Donor', () => {
      const result = runCompute(contactsHelper, {
        state: {
          form: { partyType: PARTY_TYPES.donor },
        },
      });
      expect(result.contactPrimary).toMatchObject({
        header: 'Tell Us About the Donor You Are Filing For',
        nameLabel: 'Name of petitioner',
      });
    });

    it('should validate form view information for party type Estate with an Executor/Personal Representative/Fiduciary/etc.', () => {
      const result = runCompute(contactsHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.estate,
          },
        },
      });
      expect(result.contactPrimary).toMatchObject({
        displaySecondaryName: true,
        displayTitle: true,
        header:
          'Tell Us About Yourself as the Executor/Personal Representative/etc. For This Estate',
        nameLabel: 'Name of decedent',
        secondaryNameLabel: 'Name of executor/personal representative, etc.',
      });
    });

    it('should validate form view information for party type Estate without an Executor/Personal Representative/Fiduciary/etc.', () => {
      const result = runCompute(contactsHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.estateWithoutExecutor,
          },
        },
      });
      expect(result.contactPrimary).toMatchObject({
        displayInCareOf: true,
        header: 'Tell Us About the Estate You Are Filing For',
        nameLabel: 'Name of decedent',
      });
    });

    it('should validate form view information for party type Guardian', () => {
      const result = runCompute(contactsHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.guardian,
          },
        },
      });
      expect(result.contactPrimary).toMatchObject({
        displaySecondaryName: true,
        header: 'Tell Us About Yourself as the Guardian for This Taxpayer',
        nameLabel: 'Name of taxpayer',
        secondaryNameLabel: 'Name of guardian',
      });
    });

    it('should validate form view information for party type Next Friend for a Legally Incompetent Person (Without a Guardian, Conservator, or other like Fiduciary)', () => {
      const result = runCompute(contactsHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.nextFriendForIncompetentPerson,
          },
        },
      });
      expect(result.contactPrimary).toMatchObject({
        displaySecondaryName: true,
        header:
          'Tell Us About Yourself as the Next Friend for This Legally Incompetent Person',
        nameLabel: 'Name of legally incompetent person',
        secondaryNameLabel: 'Name of next friend',
      });
    });

    it('should validate form view information for party type Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)', () => {
      const result = runCompute(contactsHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.nextFriendForMinor,
          },
        },
      });
      expect(result.contactPrimary).toMatchObject({
        displaySecondaryName: true,
        header: 'Tell Us About Yourself as the Next Friend for This Minor',
        nameLabel: 'Name of minor',
        secondaryNameLabel: 'Name of next friend',
      });
    });

    it('should validate form view information for party type Partnership (as a partnership representative under the BBA regime)', () => {
      const result = runCompute(contactsHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.partnershipBBA,
          },
        },
      });
      expect(result.contactPrimary).toMatchObject({
        displaySecondaryName: true,
        header: 'Tell Us About Yourself as the Partnership Representative',
        nameLabel: 'Business name',
        secondaryNameLabel: 'Partnership representative name',
      });
    });

    it('should validate form view information for party type Partnership (as a partner other than Tax Matters Partner)', () => {
      const result = runCompute(contactsHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.partnershipOtherThanTaxMatters,
          },
        },
      });
      expect(result.contactPrimary).toMatchObject({
        displaySecondaryName: true,
        header:
          'Tell Us About Yourself as the Partner (Other than Tax Matters Partner)',
        nameLabel: 'Business name',
        secondaryNameLabel: 'Name of partner (other than TMP)',
      });
    });

    it('should validate form view information for party type Partnership (as the Tax Matters Partner)', () => {
      const result = runCompute(contactsHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.partnershipAsTaxMattersPartner,
          },
        },
      });
      expect(result.contactPrimary).toMatchObject({
        displaySecondaryName: true,
        header: 'Tell Us About Yourself as the Tax Matters Partner',
        nameLabel: 'Partnership name',
        secondaryNameLabel: 'Tax Matters Partner name',
      });
    });

    it('should validate form view information for party type Petitioner', () => {
      const result = runCompute(contactsHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.petitioner,
          },
        },
      });
      expect(result.contactPrimary).toMatchObject({
        header: 'Tell Us About Yourself',
        nameLabel: 'Name',
      });
    });

    it('should validate form view information for party type Petitioner & Spouse', () => {
      const result = runCompute(contactsHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.petitionerSpouse,
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
          nameLabel: 'Spouse’s name',
        },
      });
    });

    it('should validate form view information for party type Petitioner & Deceased Spouse', () => {
      const result = runCompute(contactsHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.petitionerDeceasedSpouse,
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

    it('should validate form view information for party type Surviving Spouse', () => {
      const result = runCompute(contactsHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.survivingSpouse,
          },
        },
      });
      expect(result.contactPrimary).toMatchObject({
        displaySecondaryName: true,
        header: 'Tell Us About Yourself as the Surviving Spouse',
        nameLabel: 'Name of deceased spouse',
        secondaryNameLabel: 'Name of surviving spouse',
      });
    });

    it('should validate form view information for party type Transferee', () => {
      const result = runCompute(contactsHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.transferee,
          },
        },
      });
      expect(result.contactPrimary).toMatchObject({
        header: 'Tell Us About the Transferee You Are Filing For',
        nameLabel: 'Name of petitioner',
      });
    });

    it('should validate form view information for party type Trust', () => {
      const result = runCompute(contactsHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.trust,
          },
        },
      });
      expect(result.contactPrimary).toMatchObject({
        displaySecondaryName: true,
        header: 'Tell Us About Yourself as the Trustee',
        nameLabel: 'Name of trust',
        secondaryNameLabel: 'Name of trustee',
      });
    });
  });

  describe('user role private practitioner', () => {
    beforeAll(() => {
      applicationContext.getCurrentUser = () => privatePractitionerUser;
    });

    it('should validate form view information for party type Conservator', () => {
      const result = runCompute(contactsHelper, {
        state: {
          form: { partyType: PARTY_TYPES.conservator },
        },
      });
      expect(result.contactPrimary).toMatchObject({
        displaySecondaryName: true,
        header: 'Tell Us About the Conservator for This Taxpayer',
        nameLabel: 'Name of taxpayer',
        secondaryNameLabel: 'Name of conservator',
      });
    });

    it('should validate form view information for party type Corporation', () => {
      const result = runCompute(contactsHelper, {
        state: {
          form: { partyType: PARTY_TYPES.corporation },
        },
      });
      expect(result.contactPrimary).toMatchObject({
        displayInCareOf: true,
        header: 'Tell Us About the Corporation You Are Filing For',
        nameLabel: 'Business name',
      });
    });

    it('should validate form view information for party type Custodian', () => {
      const result = runCompute(contactsHelper, {
        state: {
          form: { partyType: PARTY_TYPES.custodian },
        },
      });
      expect(result.contactPrimary).toMatchObject({
        displaySecondaryName: true,
        header: 'Tell Us About the Custodian for This Taxpayer',
        nameLabel: 'Name of taxpayer',
        secondaryNameLabel: 'Name of custodian',
      });
    });

    it('should validate form view information for party type Donor', () => {
      const result = runCompute(contactsHelper, {
        state: {
          form: { partyType: PARTY_TYPES.donor },
        },
      });
      expect(result.contactPrimary).toMatchObject({
        header: 'Tell Us About the Donor You Are Filing For',
        nameLabel: 'Name of petitioner',
      });
    });

    it('should validate form view information for party type Estate with an Executor/Personal Representative/Fiduciary/etc.', () => {
      const result = runCompute(contactsHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.estate,
          },
        },
      });
      expect(result.contactPrimary).toMatchObject({
        displaySecondaryName: true,
        displayTitle: true,
        header:
          'Tell Us About the Executor/Personal Representative/etc. For This Estate',
        nameLabel: 'Name of decedent',
        secondaryNameLabel: 'Name of executor/personal representative, etc.',
      });
    });

    it('should validate form view information for party type Estate without an Executor/Personal Representative/Fiduciary/etc.', () => {
      const result = runCompute(contactsHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.estateWithoutExecutor,
          },
        },
      });
      expect(result.contactPrimary).toMatchObject({
        displayInCareOf: true,
        header: 'Tell Us About the Estate You Are Filing For',
        nameLabel: 'Name of decedent',
      });
    });

    it('should validate form view information for party type Guardian', () => {
      const result = runCompute(contactsHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.guardian,
          },
        },
      });
      expect(result.contactPrimary).toMatchObject({
        displaySecondaryName: true,
        header: 'Tell Us About the Guardian for This Taxpayer',
        nameLabel: 'Name of taxpayer',
        secondaryNameLabel: 'Name of guardian',
      });
    });

    it('should validate form view information for party type Next Friend for a Legally Incompetent Person (Without a Guardian, Conservator, or other like Fiduciary)', () => {
      const result = runCompute(contactsHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.nextFriendForIncompetentPerson,
          },
        },
      });
      expect(result.contactPrimary).toMatchObject({
        displaySecondaryName: true,
        header:
          'Tell Us About the Next Friend for This Legally Incompetent Person',
        nameLabel: 'Name of legally incompetent person',
        secondaryNameLabel: 'Name of next friend',
      });
    });

    it('should validate form view information for party type Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)', () => {
      const result = runCompute(contactsHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.nextFriendForMinor,
          },
        },
      });
      expect(result.contactPrimary).toMatchObject({
        displaySecondaryName: true,
        header: 'Tell Us About the Next Friend for This Minor',
        nameLabel: 'Name of minor',
        secondaryNameLabel: 'Name of next friend',
      });
    });

    it('should validate form view information for party type Partnership (as a partnership representative under the BBA regime)', () => {
      const result = runCompute(contactsHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.partnershipBBA,
          },
        },
      });
      expect(result.contactPrimary).toMatchObject({
        displaySecondaryName: true,
        header: 'Tell Us About the Partnership Representative',
        nameLabel: 'Business name',
        secondaryNameLabel: 'Name of partnership representative',
      });
    });

    it('should validate form view information for party type Partnership (as a partner other than Tax Matters Partner)', () => {
      const result = runCompute(contactsHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.partnershipOtherThanTaxMatters,
          },
        },
      });
      expect(result.contactPrimary).toMatchObject({
        displaySecondaryName: true,
        header: 'Tell Us About the Partner (Other than Tax Matters Partner)',
        nameLabel: 'Business name',
        secondaryNameLabel: 'Name of partner (other than TMP)',
      });
    });

    it('should validate form view information for party type Partnership (as the Tax Matters Partner)', () => {
      const result = runCompute(contactsHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.partnershipAsTaxMattersPartner,
          },
        },
      });
      expect(result.contactPrimary).toMatchObject({
        displaySecondaryName: true,
        header: 'Tell Us About the Tax Matters Partner',
        nameLabel: 'Name of Partnership',
        secondaryNameLabel: 'Name of Tax Matters Partner',
      });
    });

    it('should validate form view information for party type Petitioner', () => {
      const result = runCompute(contactsHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.petitioner,
          },
        },
      });
      expect(result.contactPrimary).toMatchObject({
        header: 'Tell Us About the Petitioner',
        nameLabel: 'Name',
      });
    });

    it('should validate form view information for party type Petitioner & Spouse', () => {
      const result = runCompute(contactsHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.petitionerSpouse,
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

    it('should validate form view information for party type Petitioner & Deceased Spouse', () => {
      const result = runCompute(contactsHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.petitionerDeceasedSpouse,
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

    it('should validate form view information for party type Surviving Spouse', () => {
      const result = runCompute(contactsHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.survivingSpouse,
          },
        },
      });
      expect(result.contactPrimary).toMatchObject({
        displaySecondaryName: true,
        header: 'Tell Us About the Surviving Spouse',
        nameLabel: 'Name of deceased spouse',
        secondaryNameLabel: 'Name of surviving spouse',
      });
    });

    it('should validate form view information for party type Transferee', () => {
      const result = runCompute(contactsHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.transferee,
          },
        },
      });
      expect(result.contactPrimary).toMatchObject({
        header: 'Tell Us About the Transferee You Are Filing For',
        nameLabel: 'Name of petitioner',
      });
    });

    it('should validate form view information for party type Trust', () => {
      const result = runCompute(contactsHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.trust,
          },
        },
      });
      expect(result.contactPrimary).toMatchObject({
        displaySecondaryName: true,
        header: 'Tell Us About the Trustee',
        nameLabel: 'Name of trust',
        secondaryNameLabel: 'Name of trustee',
      });
    });
  });
});
