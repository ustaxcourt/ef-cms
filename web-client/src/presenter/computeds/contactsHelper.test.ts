import { PARTY_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { contactsHelper as contactsHelperComputed } from './contactsHelper';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import {
  petitionerUser,
  petitionsClerkUser,
  privatePractitionerUser,
} from '../../../../shared/src/test/mockUsers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

describe('contactsHelper', () => {
  let mockUser;
  let baseState;
  let mockForm;

  const contactsHelper = withAppContextDecorator(
    contactsHelperComputed,
    applicationContext,
  );

  // const getBaseState = user => {
  //   mockUser = { ...user };
  //   return {
  //     permissions: getUserPermissions(user),
  //   };
  // };

  beforeEach(() => {
    baseState = {
      // ...getBaseState(mockUser),
      caseDetail: {},
      form: mockForm,
    };
  });

  describe('user role petitioner', () => {
    it.only('should validate form view information for party type Conservator', () => {
      mockUser = petitionerUser;
      mockForm = { partyType: PARTY_TYPES.conservator };

      console.log('baseState.form', baseState.form);

      const result = runCompute(contactsHelper, {
        state: {
          ...baseState,
          //fix this PLEASE
          // form: { partyType: PARTY_TYPES.conservator },
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
      applicationContext.getCurrentUser.mockReturnValue(
        privatePractitionerUser,
      );
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

  describe('showPaperPetitionEmailFieldAndConsentBox', () => {
    beforeAll(() => {
      applicationContext.getCurrentUser.mockReturnValue(petitionerUser);
    });

    it('should return false if its an external user', () => {
      const result = runCompute(contactsHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.partnershipAsTaxMattersPartner,
          },
        },
      });
      expect(result.showPaperPetitionEmailFieldAndConsentBox).toEqual(false);
    });

    it('should return true if its a petitions clerk user', () => {
      applicationContext.getCurrentUser.mockReturnValue(petitionsClerkUser);

      const result = runCompute(contactsHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.partnershipAsTaxMattersPartner,
          },
        },
      });
      expect(result.showPaperPetitionEmailFieldAndConsentBox).toEqual(true);
    });
  });
});
