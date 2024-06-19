import { getFilePetitionPetitionerInformationAction } from '@web-client/presenter/actions/getFilePetitionPetitionerInformationAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getFilePetitionPetitionerInformationAction', () => {
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
    const results = await runAction(
      getFilePetitionPetitionerInformationAction,
      {
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
      },
    );

    const { petitionerInformationAction } = results.output;
    expect(petitionerInformationAction).toEqual({
      businessType: 'TEST_businessType',
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
        address1: 'TEST_PRIMARY_address1',
        address2: 'TEST_PRIMARY_address2',
        address3: 'TEST_PRIMARY_address3',
        city: 'TEST_PRIMARY_city',
        country: 'TEST_PRIMARY_country',
        countryType: 'TEST_PRIMARY_countryType',
        placeOfLegalResidence: 'TEST_PRIMARY_placeOfLegalResidence',
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
    const results = await runAction(
      getFilePetitionPetitionerInformationAction,
      {
        state: {
          form: {
            ...STATE_FORM,
            contactPrimary: {
              address2: 'TEST_PRIMARY_address2',
              address3: 'TEST_PRIMARY_address3',

              primary: true,
            },
            contactSecondary: {
              address1: 'TEST_SECONDARH_address1',
              city: 'TEST_SECONDARH_city',
              countryType: 'TEST_SECONDARH_countryType',
              placeOfLegalResidence: 'TEST_SECONDARH_placeOfLegalResidence',
              postalCode: 'TEST_SECONDARH_postalCode',
              secondary: true,
              state: 'TEST_SECONDARH_state',
            },
            useSameAsPrimary: false,
          },
        },
      },
    );

    const { petitionerInformationAction } = results.output;
    expect(petitionerInformationAction).toEqual({
      businessType: 'TEST_businessType',
      contactPrimary: {
        address2: 'TEST_PRIMARY_address2',
        address3: 'TEST_PRIMARY_address3',
        primary: true,
      },
      contactSecondary: {
        address1: 'TEST_SECONDARH_address1',
        city: 'TEST_SECONDARH_city',
        countryType: 'TEST_SECONDARH_countryType',
        placeOfLegalResidence: 'TEST_SECONDARH_placeOfLegalResidence',
        postalCode: 'TEST_SECONDARH_postalCode',
        secondary: true,
        state: 'TEST_SECONDARH_state',
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
});
