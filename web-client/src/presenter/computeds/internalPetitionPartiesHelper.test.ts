import {
  ALLOWLIST_FEATURE_FLAGS,
  FILING_TYPES,
  PARTY_TYPES,
  ROLES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import {
  docketClerk1User,
  petitionerUser,
  petitionsClerkUser,
} from '../../../../shared/src/test/mockUsers';
import { internalPetitionPartiesHelper as internalPetitionPartiesHelperComputed } from './internalPetitionPartiesHelper';
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
        user: docketClerk1User,
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
        user: docketClerk1User,
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
        user: docketClerk1User,
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
        user: docketClerk1User,
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
        user: docketClerk1User,
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
        user: docketClerk1User,
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
        user: docketClerk1User,
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
        user: docketClerk1User,
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
        user: docketClerk1User,
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
        user: docketClerk1User,
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
        user: docketClerk1User,
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
        user: docketClerk1User,
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
        user: docketClerk1User,
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
        user: docketClerk1User,
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
        user: docketClerk1User,
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
        user: docketClerk1User,
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
        user: docketClerk1User,
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
        user: docketClerk1User,
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
      user: docketClerk1User,
    };

    it('should not show email and consent fields when the e-consent feature flag is disabled', () => {
      const result = runCompute(internalPetitionPartiesHelper, {
        state: {
          ...baseState,
          featureFlags: {
            [ALLOWLIST_FEATURE_FLAGS.E_CONSENT_FIELDS_ENABLED_FEATURE_FLAG.key]:
              false,
          },
          user: petitionsClerkUser,
        },
      });

      expect(result.showPaperPetitionEmailFieldAndConsentBox).toEqual(false);
    });

    it('should not show email and consent fields for external user', () => {
      const result = runCompute(internalPetitionPartiesHelper, {
        state: { ...baseState, user: petitionerUser },
      });

      expect(result.showPaperPetitionEmailFieldAndConsentBox).toEqual(false);
    });

    it('should show email and consent fields for an internal user with paper filing', () => {
      const result = runCompute(internalPetitionPartiesHelper, {
        state: {
          ...baseState,
          form: {
            isPaper: true,
          },
          user: petitionsClerkUser,
        },
      });

      expect(result.showPaperPetitionEmailFieldAndConsentBox).toEqual(true);
    });

    it('should not show email and consent fields for an internal user with an electronic filing', () => {
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
          user: petitionsClerkUser,
        },
      });

      expect(result.showPaperPetitionEmailFieldAndConsentBox).toEqual(false);
    });

    it('should show email and consent fields when petition was filed electronically by a private practitioner', () => {
      const result = runCompute(internalPetitionPartiesHelper, {
        state: {
          ...baseState,
          featureFlags: {
            [ALLOWLIST_FEATURE_FLAGS.E_CONSENT_FIELDS_ENABLED_FEATURE_FLAG.key]:
              true,
          },
          form: {
            isPaper: false,
            privatePractitioners: [{ role: ROLES.privatePractitioner }],
          },
          user: petitionsClerkUser,
        },
      });

      expect(result.showPaperPetitionEmailFieldAndConsentBox).toEqual(true);
    });
  });

  describe('showSecondaryContactEmailFieldAndConsentBox', () => {
    it('should display secondary contact email field when petition is filed by a petitioner', () => {
      const result = runCompute(internalPetitionPartiesHelper, {
        state: {
          featureFlags: {
            [ALLOWLIST_FEATURE_FLAGS.E_CONSENT_FIELDS_ENABLED_FEATURE_FLAG.key]:
              true,
          },
          form: {
            filingType: FILING_TYPES.petitioner[1],
            isPaper: false,
          },
          user: petitionsClerkUser,
        },
      });

      expect(result.showSecondaryContactEmailFieldAndConsentBox).toEqual(true);
    });
    it('should display secondary contact email field when petition is filed by a private practitioner', () => {
      const result = runCompute(internalPetitionPartiesHelper, {
        state: {
          featureFlags: {
            [ALLOWLIST_FEATURE_FLAGS.E_CONSENT_FIELDS_ENABLED_FEATURE_FLAG.key]:
              true,
          },
          form: {
            filingType: FILING_TYPES.privatePractitioner[1],
            isPaper: false,
          },
          user: petitionsClerkUser,
        },
      });

      expect(result.showSecondaryContactEmailFieldAndConsentBox).toEqual(true);
    });
  });
});
