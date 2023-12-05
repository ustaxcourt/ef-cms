import {
  ALLOWLIST_FEATURE_FLAGS,
  PARTY_TYPES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { internalPetitionPartiesHelper as internalPetitionPartiesHelperComputed } from './internalPetitionPartiesHelper';
import {
  petitionerUser,
  petitionsClerkUser,
} from '../../../../shared/src/test/mockUsers';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

const internalPetitionPartiesHelper = withAppContextDecorator(
  internalPetitionPartiesHelperComputed,
  applicationContext,
);

describe('internalPetitionPartiesHelper', () => {
  it('should validate form view information for party type Conservator', () => {
    const result = runCompute(internalPetitionPartiesHelper, {
      state: {
        constants: {
          PARTY_TYPES,
        },
        form: { partyType: PARTY_TYPES.conservator },
      },
    });

    expect(result).toMatchObject({
      contactPrimary: {
        displaySecondaryName: true,
        header: 'Conservator Information',
        nameLabel: 'Name of taxpayer',
        secondaryNameLabel: 'Name of conservator',
      },
    });
  });

  it('should validate form view information for party type Corporation', () => {
    const result = runCompute(internalPetitionPartiesHelper, {
      state: {
        constants: {
          PARTY_TYPES,
        },
        form: { partyType: PARTY_TYPES.corporation },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        displayInCareOf: true,
        header: 'Corporation Information',
        nameLabel: 'Business name',
      },
    });
  });

  it('should validate form view information for party type Custodian', () => {
    const result = runCompute(internalPetitionPartiesHelper, {
      state: {
        constants: {
          PARTY_TYPES,
        },
        form: { partyType: PARTY_TYPES.custodian },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        displaySecondaryName: true,
        header: 'Custodian Information',
        nameLabel: 'Name of taxpayer',
        secondaryNameLabel: 'Name of custodian',
      },
    });
  });

  it('should validate form view information for party type Donor', () => {
    const result = runCompute(internalPetitionPartiesHelper, {
      state: {
        constants: {
          PARTY_TYPES,
        },
        form: { partyType: PARTY_TYPES.donor },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        header: 'Donor Information',
        nameLabel: 'Name of petitioner',
      },
    });
  });

  it('should validate form view information for party type Estate with an Executor/Personal Representative/Fiduciary/etc.', () => {
    const result = runCompute(internalPetitionPartiesHelper, {
      state: {
        constants: {
          PARTY_TYPES,
        },
        form: {
          partyType: PARTY_TYPES.estate,
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        displaySecondaryName: true,
        displayTitle: true,
        header: 'Executor/Personal Representative/Etc.',
        nameLabel: 'Name of decedent',
        secondaryNameLabel: 'Name of executor/personal representative, etc.',
      },
    });
  });

  it('should validate form view information for party type Estate without an Executor/Personal Representative/Fiduciary/etc.', () => {
    const result = runCompute(internalPetitionPartiesHelper, {
      state: {
        constants: {
          PARTY_TYPES,
        },
        form: {
          partyType: PARTY_TYPES.estateWithoutExecutor,
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        displayInCareOf: true,
        header: 'Estate Information',
        nameLabel: 'Name of decedent',
      },
    });
  });

  it('should validate form view information for party type Guardian', () => {
    const result = runCompute(internalPetitionPartiesHelper, {
      state: {
        constants: {
          PARTY_TYPES,
        },
        form: {
          partyType: PARTY_TYPES.guardian,
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        displaySecondaryName: true,
        header: 'Guardian Information',
        nameLabel: 'Name of taxpayer',
        secondaryNameLabel: 'Name of guardian',
      },
    });
  });

  it('should validate form view information for party type Next Friend for a Legally Incompetent Person (Without a Guardian, Conservator, or other like Fiduciary)', () => {
    const result = runCompute(internalPetitionPartiesHelper, {
      state: {
        constants: {
          PARTY_TYPES,
        },
        form: {
          partyType: PARTY_TYPES.nextFriendForIncompetentPerson,
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        displaySecondaryName: true,
        header: 'Next Friend Information',
        nameLabel: 'Name of legally incompetent person',
        secondaryNameLabel: 'Name of next friend',
      },
    });
  });

  it('should validate form view information for party type Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)', () => {
    const result = runCompute(internalPetitionPartiesHelper, {
      state: {
        constants: {
          PARTY_TYPES,
        },
        form: {
          partyType: PARTY_TYPES.nextFriendForMinor,
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        displaySecondaryName: true,
        header: 'Next Friend Information',
        nameLabel: 'Name of minor',
        secondaryNameLabel: 'Name of next friend',
      },
    });
  });

  it('should validate form view information for party type Partnership (as a partnership representative under BBA)', () => {
    const result = runCompute(internalPetitionPartiesHelper, {
      state: {
        constants: {
          PARTY_TYPES,
        },
        form: {
          partyType: PARTY_TYPES.partnershipBBA,
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        displaySecondaryName: true,
        header: 'Partnership Representative',
        nameLabel: 'Business name',
        secondaryNameLabel: 'Name of partnership representative',
      },
    });
  });

  it('should validate form view information for party type Partnership (as a partner other than Tax Matters Partner)', () => {
    const result = runCompute(internalPetitionPartiesHelper, {
      state: {
        constants: {
          PARTY_TYPES,
        },
        form: {
          partyType: PARTY_TYPES.partnershipOtherThanTaxMatters,
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        displaySecondaryName: true,
        header: 'Partnership (Other than Tax Matters Partner) Information',
        nameLabel: 'Business name',
        secondaryNameLabel: 'Name of partner (other than TMP)',
      },
    });
  });

  it('should validate form view information for party type Partnership (as the Tax Matters Partner)', () => {
    const result = runCompute(internalPetitionPartiesHelper, {
      state: {
        constants: {
          PARTY_TYPES,
        },
        form: {
          partyType: PARTY_TYPES.partnershipAsTaxMattersPartner,
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        displaySecondaryName: true,
        header: 'Tax Matters Partner Information',
        nameLabel: 'Business name',
        secondaryNameLabel: 'Name of Tax Matters Partner',
      },
    });
  });

  it('should validate form view information for party type Petitioner', () => {
    const result = runCompute(internalPetitionPartiesHelper, {
      state: {
        constants: {
          PARTY_TYPES,
        },
        form: {
          partyType: PARTY_TYPES.petitioner,
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
    const result = runCompute(internalPetitionPartiesHelper, {
      state: {
        constants: {
          PARTY_TYPES,
        },
        form: {
          partyType: PARTY_TYPES.petitionerSpouse,
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
        nameLabel: 'Spouse’s name',
      },
    });
  });

  it('should validate form view information for party type Petitioner & Deceased Spouse', () => {
    const result = runCompute(internalPetitionPartiesHelper, {
      state: {
        constants: {
          PARTY_TYPES,
        },
        form: {
          partyType: PARTY_TYPES.petitionerDeceasedSpouse,
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
        nameLabel: 'Name of deceased spouse',
      },
    });
  });

  it('should validate form view information for party type Surviving Spouse', () => {
    const result = runCompute(internalPetitionPartiesHelper, {
      state: {
        constants: {
          PARTY_TYPES,
        },
        form: {
          partyType: PARTY_TYPES.survivingSpouse,
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        displaySecondaryName: true,
        header: 'Petitioner Information',
        nameLabel: 'Name of deceased spouse',
        secondaryNameLabel: 'Name of surviving spouse',
      },
    });
  });

  it('should validate form view information for party type Transferee', () => {
    const result = runCompute(internalPetitionPartiesHelper, {
      state: {
        constants: {
          PARTY_TYPES,
        },
        form: {
          partyType: PARTY_TYPES.transferee,
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        header: 'Transferee Information',
        nameLabel: 'Name of petitioner',
      },
    });
  });

  it('should validate form view information for party type Trust', () => {
    const result = runCompute(internalPetitionPartiesHelper, {
      state: {
        constants: {
          PARTY_TYPES,
        },
        form: {
          partyType: PARTY_TYPES.trust,
        },
      },
    });
    expect(result).toMatchObject({
      contactPrimary: {
        displaySecondaryName: true,
        header: 'Trustee Information',
        nameLabel: 'Name of trust',
        secondaryNameLabel: 'Name of trustee',
      },
    });
  });

  describe('showPaperPetitionEmailFieldAndConsentBox', () => {
    const baseState = {
      featureFlags: {
        [ALLOWLIST_FEATURE_FLAGS.E_CONSENT_FIELDS_ENABLED_FEATURE_FLAG.key]:
          true,
      },
      form: {
        isPaper: undefined,
        partyType: PARTY_TYPES.partnershipAsTaxMattersPartner,
      },
    };

    it('should be false when the current user is an external user', () => {
      applicationContext.getCurrentUser.mockReturnValue(petitionerUser);

      const result = runCompute(internalPetitionPartiesHelper, {
        state: baseState,
      });

      expect(result.showPaperPetitionEmailFieldAndConsentBox).toEqual(false);
    });

    it('should be true when the current user is a petitions clerk user', () => {
      applicationContext.getCurrentUser.mockReturnValue(petitionsClerkUser);

      const result = runCompute(internalPetitionPartiesHelper, {
        state: {
          ...baseState,
          form: {
            isPaper: true,
          },
        },
      });

      expect(result.showPaperPetitionEmailFieldAndConsentBox).toEqual(true);
    });

    it('should be false when the e-consent feature flag is disabled', () => {
      applicationContext.getCurrentUser.mockReturnValue(petitionsClerkUser);

      const result = runCompute(internalPetitionPartiesHelper, {
        state: {
          ...baseState,
          featureFlags: {
            [ALLOWLIST_FEATURE_FLAGS.E_CONSENT_FIELDS_ENABLED_FEATURE_FLAG.key]:
              false,
          },
        },
      });

      expect(result.showPaperPetitionEmailFieldAndConsentBox).toEqual(false);
    });

    it('should be true when the e-consent feature flag is enabled, it is a paper petition and the current user is internal', () => {
      applicationContext.getCurrentUser.mockReturnValue(petitionsClerkUser);

      const result = runCompute(internalPetitionPartiesHelper, {
        state: {
          ...baseState,
          featureFlags: {
            [ALLOWLIST_FEATURE_FLAGS.E_CONSENT_FIELDS_ENABLED_FEATURE_FLAG.key]:
              true,
          },
          form: {
            isPaper: true,
          },
        },
      });

      expect(result.showPaperPetitionEmailFieldAndConsentBox).toEqual(true);
    });

    it('should be false when the e-consent feature flag is enabled, and it is NOT a paper petition', () => {
      applicationContext.getCurrentUser.mockReturnValue(petitionsClerkUser);

      const result = runCompute(internalPetitionPartiesHelper, {
        state: {
          ...baseState,
          featureFlags: {
            [ALLOWLIST_FEATURE_FLAGS.E_CONSENT_FIELDS_ENABLED_FEATURE_FLAG.key]:
              true,
          },
          form: {
            isPaper: false,
          },
        },
      });

      expect(result.showPaperPetitionEmailFieldAndConsentBox).toEqual(false);
    });
  });
});
