import { CONTACT_TYPES } from '@shared/business/entities/EntityConstants';
import { getCreatePetitionStep1DataAction } from '@web-client/presenter/actions/getCreatePetitionStep1DataAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getCreatePetitionStep1DataAction', () => {
  const STATE_FORM = {
    businessType: 'TEST_businessType',
    corporateDisclosureFile: 'TEST_corporateDisclosureFile',
    corporateDisclosureFileSize: 'TEST_corporateDisclosureFileSize',
    countryType: 'TEST_countryType',
    estateType: 'TEST_estateType',
    filingType: 'TEST_filingType',
    hasSpouseConsent: 'TEST_hasSpouseConsent',
    isSpouseDeceased: 'TEST_isSpouseDeceased',
    minorIncompetentType: 'TEST_minorIncompetentType',
    otherType: 'TEST_otherType',
    partyType: 'TEST_partyType',
    petitionType: 'TEST_petitionType',
  };

  it('should fetch step 2 related data from state.form when useSameAsPrimary is true', async () => {
    const results = await runAction(getCreatePetitionStep1DataAction, {
      state: {
        form: {
          ...STATE_FORM,
          contactPrimary: {
            address1: 'TEST_PRIMARY_address1',
            address2: 'TEST_PRIMARY_address2',
            address3: 'TEST_PRIMARY_address3',
            city: 'TEST_PRIMARY_city',
            country: 'TEST_PRIMARY_country',
            countryType: 'TEST_PRIMARY_countryType',
            placeOfLegalResidence: 'TEST_PRIMARY_placeOfLegalResidence',
            postalCode: 'TEST_PRIMARY_postalCode',
            primary: true,
            state: 'TEST_PRIMARY_state',
          },
          contactSecondary: {
            secondary: true,
          },
          useSameAsPrimary: true,
        },
      },
    });

    const { createPetitionStep1Data } = results.output;
    expect(createPetitionStep1Data).toEqual({
      businessType: 'TEST_businessType',
      contactPrimary: {
        address1: 'TEST_PRIMARY_address1',
        address2: 'TEST_PRIMARY_address2',
        address3: 'TEST_PRIMARY_address3',
        city: 'TEST_PRIMARY_city',
        contactType: CONTACT_TYPES.primary,
        country: 'TEST_PRIMARY_country',
        countryType: 'TEST_PRIMARY_countryType',
        placeOfLegalResidence: 'TEST_PRIMARY_placeOfLegalResidence',
        postalCode: 'TEST_PRIMARY_postalCode',
        primary: true,
        state: 'TEST_PRIMARY_state',
      },
      contactSecondary: {
        address1: 'TEST_PRIMARY_address1',
        address2: 'TEST_PRIMARY_address2',
        address3: 'TEST_PRIMARY_address3',
        city: 'TEST_PRIMARY_city',
        contactType: CONTACT_TYPES.secondary,
        country: 'TEST_PRIMARY_country',
        countryType: 'TEST_PRIMARY_countryType',
        postalCode: 'TEST_PRIMARY_postalCode',
        secondary: true,
        state: 'TEST_PRIMARY_state',
      },
      corporateDisclosureFile: 'TEST_corporateDisclosureFile',
      corporateDisclosureFileSize: 'TEST_corporateDisclosureFileSize',
      countryType: 'TEST_countryType',
      estateType: 'TEST_estateType',
      filingType: 'TEST_filingType',
      hasSpouseConsent: 'TEST_hasSpouseConsent',
      isSpouseDeceased: 'TEST_isSpouseDeceased',
      minorIncompetentType: 'TEST_minorIncompetentType',
      otherType: 'TEST_otherType',
      partyType: 'TEST_partyType',
      petitionType: 'TEST_petitionType',
      useSameAsPrimary: true,
    });
  });

  it('should fetch step 2 related data from state.form when useSameAsPrimary is false', async () => {
    const results = await runAction(getCreatePetitionStep1DataAction, {
      state: {
        form: {
          ...STATE_FORM,
          contactPrimary: {
            address2: 'TEST_PRIMARY_address2',
            address3: 'TEST_PRIMARY_address3',
            primary: true,
          },
          contactSecondary: {
            address1: 'TEST_SECONDARY_address1',
            city: 'TEST_SECONDARY_city',
            countryType: 'TEST_SECONDARY_countryType',
            placeOfLegalResidence: 'TEST_SECONDARY_placeOfLegalResidence',
            postalCode: 'TEST_SECONDARY_postalCode',
            secondary: true,
            state: 'TEST_SECONDARY_state',
          },
          useSameAsPrimary: false,
        },
      },
    });

    const { createPetitionStep1Data } = results.output;
    expect(createPetitionStep1Data).toEqual({
      businessType: 'TEST_businessType',
      contactPrimary: {
        address2: 'TEST_PRIMARY_address2',
        address3: 'TEST_PRIMARY_address3',
        contactType: CONTACT_TYPES.primary,
        primary: true,
      },
      contactSecondary: {
        address1: 'TEST_SECONDARY_address1',
        city: 'TEST_SECONDARY_city',
        contactType: CONTACT_TYPES.secondary,
        countryType: 'TEST_SECONDARY_countryType',
        placeOfLegalResidence: 'TEST_SECONDARY_placeOfLegalResidence',
        postalCode: 'TEST_SECONDARY_postalCode',
        secondary: true,
        state: 'TEST_SECONDARY_state',
      },
      corporateDisclosureFile: 'TEST_corporateDisclosureFile',
      corporateDisclosureFileSize: 'TEST_corporateDisclosureFileSize',
      countryType: 'TEST_countryType',
      estateType: 'TEST_estateType',
      filingType: 'TEST_filingType',
      hasSpouseConsent: 'TEST_hasSpouseConsent',
      isSpouseDeceased: 'TEST_isSpouseDeceased',
      minorIncompetentType: 'TEST_minorIncompetentType',
      otherType: 'TEST_otherType',
      partyType: 'TEST_partyType',
      petitionType: 'TEST_petitionType',
      useSameAsPrimary: false,
    });
  });

  it('should set contact type for secondary contact when a secondary contact is present', async () => {
    const results = await runAction(getCreatePetitionStep1DataAction, {
      state: {
        form: {
          ...STATE_FORM,
          contactPrimary: {
            address2: 'TEST_PRIMARY_address2',
            address3: 'TEST_PRIMARY_address3',
            primary: true,
          },
          contactSecondary: {
            address1: 'TEST_SECONDARY_address1',
            city: 'TEST_SECONDARY_city',
            countryType: 'TEST_SECONDARY_countryType',
            placeOfLegalResidence: 'TEST_SECONDARY_placeOfLegalResidence',
            postalCode: 'TEST_SECONDARY_postalCode',
            secondary: true,
            state: 'TEST_SECONDARY_state',
          },
          useSameAsPrimary: false,
        },
      },
    });
    const { createPetitionStep1Data } = results.output;
    expect(createPetitionStep1Data.contactSecondary.contactType).toEqual(
      CONTACT_TYPES.secondary,
    );
  });

  it('should not set contact type for secondary contact when a secondary contact is not present', async () => {
    const results = await runAction(getCreatePetitionStep1DataAction, {
      state: {
        form: {
          ...STATE_FORM,
          contactPrimary: {
            address2: 'TEST_PRIMARY_address2',
            address3: 'TEST_PRIMARY_address3',
            primary: true,
          },
        },
      },
    });
    const { createPetitionStep1Data } = results.output;
    expect(createPetitionStep1Data.contactSecondary).toBeUndefined();
  });
});
