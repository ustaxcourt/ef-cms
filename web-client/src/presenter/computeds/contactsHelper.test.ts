import { PARTY_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { contactsHelper as contactsHelperComputed } from './contactsHelper';
import {
  petitionerUser,
  privatePractitionerUser,
} from '../../../../shared/src/test/mockUsers';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

describe('contactsHelper', () => {
  const contactsHelper = withAppContextDecorator(
    contactsHelperComputed,
    applicationContext,
  );

  describe('user role petitioner', () => {
    it('should validate form view information for party type Conservator', () => {
      const result = runCompute(contactsHelper, {
        state: {
          form: { partyType: PARTY_TYPES.conservator },
          user: petitionerUser,
        },
      });

      expect(result.contactPrimary).toMatchObject({
        displaySecondaryName: true,
        header: 'Tell Us About Yourself as the Conservator for This Taxpayer',
        nameLabel: 'Name of taxpayer',
        secondaryNameLabel: 'Name of conservator',
      });
    });

    it('should return an empty object if party type is undefined', () => {
      const result = runCompute(contactsHelper, {
        state: {
          form: {
            partyType: undefined,
          },
          user: petitionerUser,
        },
      });

      expect(result).toMatchObject({});
    });

    it('should validate form view information for party type Petitioner', () => {
      const result = runCompute(contactsHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.petitioner,
          },
          user: petitionerUser,
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
          user: petitionerUser,
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
    it('should validate form view information for party type Partnership (as the Tax Matters Partner)', () => {
      const result = runCompute(contactsHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.partnershipAsTaxMattersPartner,
          },
          user: privatePractitionerUser,
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
          user: privatePractitionerUser,
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
          user: privatePractitionerUser,
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

    it('should return an empty object if party type is undefined', () => {
      const result = runCompute(contactsHelper, {
        state: {
          form: {
            partyType: undefined,
          },
          user: privatePractitionerUser,
        },
      });

      expect(result).toMatchObject({});
    });
  });
});
