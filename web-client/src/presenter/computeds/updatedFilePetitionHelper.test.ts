import {
  FILING_TYPES,
  PARTY_TYPES,
} from '@shared/business/entities/EntityConstants';
import { applicationContext } from '../../applicationContext';
import {
  petitionerUser,
  privatePractitionerUser,
} from '@shared/test/mockUsers';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { updatedFilePetitionHelper as updatedFilePetitionHelperComputed } from './updatedFilePetitionHelper';
import { withAppContextDecorator } from '../../withAppContext';

describe('updatedFilePetitionHelper', () => {
  const updatedFilePetitionHelper = withAppContextDecorator(
    updatedFilePetitionHelperComputed,
    {
      ...applicationContext,
      getConstants: () => {
        return { FILING_TYPES, PARTY_TYPES };
      },
    },
  );

  describe('businessFieldNames', () => {
    it('should return business field names for the Corporation business type', () => {
      const result = runCompute(updatedFilePetitionHelper, {
        state: {
          form: {
            businessType: 'Corporation',
          },
          user: petitionerUser,
        },
      });
      expect(result.businessFieldNames).toEqual({
        primary: 'Business name',
        showInCareOf: true,
        showInCareOfOptional: true,
      });
    });

    it('should return business field names for the "Partnership (as the Tax Matters Partner)" business type', () => {
      const result = runCompute(updatedFilePetitionHelper, {
        state: {
          form: {
            businessType: 'Partnership (as the Tax Matters Partner)',
          },
          user: petitionerUser,
        },
      });
      expect(result.businessFieldNames).toEqual({
        primary: 'Partnership name',
        secondary: 'Tax Matters Partner name',
      });
    });

    it('should return business field names for the "Partnership (as a partner other than Tax Matters Partner)" business type', () => {
      const result = runCompute(updatedFilePetitionHelper, {
        state: {
          form: {
            businessType:
              'Partnership (as a partner other than Tax Matters Partner)',
          },
          user: petitionerUser,
        },
      });
      expect(result.businessFieldNames).toEqual({
        primary: 'Business name',
        secondary: 'Name of partner (other than TMP)',
      });
    });

    it('should return business field names for the "Partnership (as a partnership representative under BBA)" business type', () => {
      const result = runCompute(updatedFilePetitionHelper, {
        state: {
          form: {
            businessType:
              'Partnership (as a partnership representative under BBA)',
          },
          user: petitionerUser,
        },
      });
      expect(result.businessFieldNames).toEqual({
        primary: 'Business name',
        secondary: 'Partnership representative name',
      });
    });
  });
  describe('filingOptions', () => {
    it('should return the filing options for petitioner', () => {
      const result = runCompute(updatedFilePetitionHelper, {
        state: { form: {}, user: petitionerUser },
      });
      expect(result.filingOptions).toEqual([
        { label: 'Myself', value: 'Myself' },
        { label: 'Myself and my spouse', value: 'Myself and my spouse' },
        { label: 'A business', value: 'A business' },
        { label: 'Other', value: 'Other' },
      ]);
    });
    it('should return filing options for practitioner', () => {
      const result = runCompute(updatedFilePetitionHelper, {
        state: { form: {}, user: privatePractitionerUser },
      });
      expect(result.filingOptions).toEqual([
        { label: 'Petitioner', value: 'Individual petitioner' },
        {
          label: 'Petitioner and petitioner spouse',
          value: 'Petitioner and spouse',
        },
        { label: 'A business', value: 'A business' },
        { label: 'Other', value: 'Other' },
      ]);
    });
  });
  describe('otherFilingOptions', () => {
    it('should return the other filing options for petitioner', () => {
      const result = runCompute(updatedFilePetitionHelper, {
        state: { form: {}, user: petitionerUser },
      });
      expect(result.otherFilingOptions).toEqual([
        'An estate or trust',
        'A minor or legally incompetent person',
        'Donor',
        'Transferee',
        'Deceased Spouse',
      ]);
    });
    it('should return other filing options for practitioner', () => {
      const result = runCompute(updatedFilePetitionHelper, {
        state: { form: {}, user: privatePractitionerUser },
      });
      expect(result.otherFilingOptions).toEqual([
        'An estate or trust',
        'Donor',
        'Transferee',
        'Deceased Spouse',
      ]);
    });
  });
  describe('showContactInformationForOtherPartyType', () => {
    const partyTypesWithOtherPartyTypeContactInfo = [
      PARTY_TYPES.donor,
      PARTY_TYPES.transferee,
      PARTY_TYPES.survivingSpouse,
      PARTY_TYPES.estate,
      PARTY_TYPES.estateWithoutExecutor,
      PARTY_TYPES.trust,
      PARTY_TYPES.conservator,
      PARTY_TYPES.guardian,
      PARTY_TYPES.custodian,
      PARTY_TYPES.nextFriendForMinor,
      PARTY_TYPES.nextFriendForIncompetentPerson,
    ];

    it.each(partyTypesWithOtherPartyTypeContactInfo)(
      'should return true for "%s" party type',
      partyType => {
        const result = runCompute(updatedFilePetitionHelper, {
          state: {
            form: {
              partyType,
            },
            user: petitionerUser,
          },
        });
        expect(result.showContactInformationForOtherPartyType).toBeTruthy();
      },
    );

    it('should return false when party type should not show contact information for other party type', () => {
      const result = runCompute(updatedFilePetitionHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.petitioner,
          },
          user: petitionerUser,
        },
      });
      expect(result.showContactInformationForOtherPartyType).toBeFalsy();
    });
  });
  describe('otherContactNameLabel', () => {
    it('should return correct labels for survivingSpouse', () => {
      const result = runCompute(updatedFilePetitionHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.survivingSpouse,
          },
          user: petitionerUser,
        },
      });
      expect(result.otherContactNameLabel).toEqual({
        primaryLabel: 'Full name of deceased spouse',
        secondaryLabel: 'Full name of surviving spouse',
      });
    });

    it('should return correct labels for estate', () => {
      const result = runCompute(updatedFilePetitionHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.estate,
          },
          user: petitionerUser,
        },
      });
      expect(result.otherContactNameLabel).toEqual({
        primaryLabel: 'Full name of decedent',
        secondaryLabel: 'Full name of executor/personal representative, etc.',
        titleLabel: 'Title',
        titleLabelNote: 'For example: executor, PR, etc.',
      });
    });

    it('should return correct labels for estateWithoutExecutor', () => {
      const result = runCompute(updatedFilePetitionHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.estateWithoutExecutor,
          },
          user: petitionerUser,
        },
      });
      expect(result.otherContactNameLabel).toEqual({
        primaryLabel: 'Full name of decedent',
        showInCareOf: true,
        showInCareOfOptional: true,
      });
    });

    it('should return correct labels for trust', () => {
      const result = runCompute(updatedFilePetitionHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.trust,
          },
          user: petitionerUser,
        },
      });
      expect(result.otherContactNameLabel).toEqual({
        primaryLabel: 'Name of trust',
        secondaryLabel: 'Full name of trustee',
      });
    });

    it('should return correct labels for conservator', () => {
      const result = runCompute(updatedFilePetitionHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.conservator,
          },
          user: petitionerUser,
        },
      });
      expect(result.otherContactNameLabel).toEqual({
        primaryLabel: 'Full name of taxpayer',
        secondaryLabel: 'Full name of conservator',
      });
    });

    it('should return correct labels for guardian', () => {
      const result = runCompute(updatedFilePetitionHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.guardian,
          },
          user: petitionerUser,
        },
      });
      expect(result.otherContactNameLabel).toEqual({
        primaryLabel: 'Full name of taxpayer',
        secondaryLabel: 'Full name of guardian',
      });
    });

    it('should return correct labels for custodian', () => {
      const result = runCompute(updatedFilePetitionHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.custodian,
          },
          user: petitionerUser,
        },
      });
      expect(result.otherContactNameLabel).toEqual({
        primaryLabel: 'Full name of taxpayer',
        secondaryLabel: 'Full name of custodian',
      });
    });

    it('should return correct labels for nextFriendForMinor', () => {
      const result = runCompute(updatedFilePetitionHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.nextFriendForMinor,
          },
          user: petitionerUser,
        },
      });
      expect(result.otherContactNameLabel).toEqual({
        primaryLabel: 'Full name of minor',
        secondaryLabel: 'Full name of next friend',
      });
    });

    it('should return correct labels for nextFriendForIncompetentPerson', () => {
      const result = runCompute(updatedFilePetitionHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.nextFriendForIncompetentPerson,
          },
          user: petitionerUser,
        },
      });
      expect(result.otherContactNameLabel).toEqual({
        primaryLabel: 'Full name of legally incompetent person',
        secondaryLabel: 'Full name of next friend',
      });
    });

    it('should return correct labels for default case', () => {
      const result = runCompute(updatedFilePetitionHelper, {
        state: {
          form: {
            partyType: 'unknown party',
          },
          user: petitionerUser,
        },
      });
      expect(result.otherContactNameLabel).toEqual({
        primaryLabel: 'Full name of petitioner',
      });
    });
  });
  describe('primaryContactNameLabel', () => {
    it('should return the correct primary contact name label when filing as a petitioner', () => {
      const result = runCompute(updatedFilePetitionHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.petitioner,
          },
          user: petitionerUser,
        },
      });
      expect(result.primaryContactNameLabel).toEqual('Full Name');
    });
    it('should return the correct primary contact name label when filing as a private practitioner', () => {
      const result = runCompute(updatedFilePetitionHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.petitioner,
          },
          user: privatePractitionerUser,
        },
      });
      expect(result.primaryContactNameLabel).toEqual('Petitioner’s full name');
    });
  });
  describe('getLetterByIndex', () => {
    it('should return the correct single-letter label for a given index', () => {
      const result = runCompute(updatedFilePetitionHelper, {
        state: {
          form: {},
          user: petitionerUser,
        },
      });
      expect(result.getLetterByIndex(1)).toEqual('b');
    });
    it('returns the correct multi-letter label when index exceeds 25 (ex: aa, ab)', () => {
      const result = runCompute(updatedFilePetitionHelper, {
        state: {
          form: {},
          user: petitionerUser,
        },
      });
      expect(result.getLetterByIndex(26)).toEqual('aa');
    });
  });
});
