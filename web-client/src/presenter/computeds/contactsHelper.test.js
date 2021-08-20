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
  });

  describe('user role private practitioner', () => {
    beforeAll(() => {
      applicationContext.getCurrentUser = () => privatePractitionerUser;
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
  });
});
