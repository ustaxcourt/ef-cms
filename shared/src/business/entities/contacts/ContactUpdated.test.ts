import { COUNTRY_TYPES } from '@shared/business/entities/EntityConstants';
import { ContactUpdated } from '@shared/business/entities/contacts/ContactUpdated';

describe('ContactUpdated', () => {
  const VALID_ENTITY = {
    address1: 'TEST_ADDRESS_1',
    city: 'TEST_CITY',
    country: 'TEST_COUNTRY',
    countryType: 'domestic',
    inCareOf: 'TEST_IN_CARE_OF',
    name: 'TEST_NAME',
    phone: 'TEST_PHONE',
    postalCode: '12345',
    state: 'CA',
  };

  const CONTACT_NAME = 'CONTACT_NAME';
  const PETITION_TYPE = 'PETITION_TYPE';
  const PARTY_TYPE = 'PARTY_TYPE';

  it('should create a valid instance of "BusinessContact" entity', () => {
    const entity = new ContactUpdated(
      VALID_ENTITY,
      CONTACT_NAME,
      PETITION_TYPE,
      PARTY_TYPE,
    );

    const errors = entity.getFormattedValidationErrors();
    expect(errors).toEqual(null);
  });

  describe('VALIDATION', () => {
    describe('SHARED', () => {
      describe('address1', () => {
        it('should return an error message for "address1" if its undefined', () => {
          const entity = new ContactUpdated(
            {
              ...VALID_ENTITY,
              address1: undefined,
            },
            CONTACT_NAME,
            PETITION_TYPE,
            PARTY_TYPE,
          );

          const errors = entity.getFormattedValidationErrors();
          expect(errors).toEqual({ address1: 'Enter mailing address' });
        });

        it('should return an error message for "address1" if its over the character limit', () => {
          const entity = new ContactUpdated(
            {
              ...VALID_ENTITY,
              address1: 'a'.repeat(101),
            },
            CONTACT_NAME,
            PETITION_TYPE,
            PARTY_TYPE,
          );

          const errors = entity.getFormattedValidationErrors();
          expect(errors).toEqual({ address1: 'Enter mailing address' });
        });
      });

      describe('address2', () => {
        it('should not return an error message for "address2" if its undefined', () => {
          const entity = new ContactUpdated(
            {
              ...VALID_ENTITY,
              address2: undefined,
            },
            CONTACT_NAME,
            PETITION_TYPE,
            PARTY_TYPE,
          );

          const errors = entity.getFormattedValidationErrors();
          expect(errors).toEqual(null);
        });

        it('should return an error message for "address2" if its over the character limit', () => {
          const entity = new ContactUpdated(
            {
              ...VALID_ENTITY,
              address2: 'a'.repeat(101),
            },
            CONTACT_NAME,
            PETITION_TYPE,
            PARTY_TYPE,
          );

          const errors = entity.getFormattedValidationErrors();
          expect(errors).toEqual({
            address2:
              '"address2" length must be less than or equal to 100 characters long',
          });
        });
      });

      describe('address3', () => {
        it('should not return an error message for "address3" if its undefined', () => {
          const entity = new ContactUpdated(
            {
              ...VALID_ENTITY,
              address3: undefined,
            },
            CONTACT_NAME,
            PETITION_TYPE,
            PARTY_TYPE,
          );

          const errors = entity.getFormattedValidationErrors();
          expect(errors).toEqual(null);
        });

        it('should return an error message for "address3" if its over the character limit', () => {
          const entity = new ContactUpdated(
            {
              ...VALID_ENTITY,
              address3: 'a'.repeat(101),
            },
            CONTACT_NAME,
            PETITION_TYPE,
            PARTY_TYPE,
          );

          const errors = entity.getFormattedValidationErrors();
          expect(errors).toEqual({
            address3:
              '"address3" length must be less than or equal to 100 characters long',
          });
        });
      });

      describe('city', () => {
        it('should return an error message for "city" if its undefined', () => {
          const entity = new ContactUpdated(
            {
              ...VALID_ENTITY,
              city: undefined,
            },
            CONTACT_NAME,
            PETITION_TYPE,
            PARTY_TYPE,
          );

          const errors = entity.getFormattedValidationErrors();
          expect(errors).toEqual({ city: 'Enter city' });
        });

        it('should return an error message for "city" if its over the character limit', () => {
          const entity = new ContactUpdated(
            {
              ...VALID_ENTITY,
              city: 'a'.repeat(101),
            },
            CONTACT_NAME,
            PETITION_TYPE,
            PARTY_TYPE,
          );

          const errors = entity.getFormattedValidationErrors();
          expect(errors).toEqual({ city: 'Enter city' });
        });
      });

      describe('inCareOf', () => {
        it('should not return an error message for "inCareOf" if its undefined', () => {
          const entity = new ContactUpdated(
            {
              ...VALID_ENTITY,
              inCareOf: undefined,
            },
            CONTACT_NAME,
            PETITION_TYPE,
            PARTY_TYPE,
          );

          const errors = entity.getFormattedValidationErrors();
          expect(errors).toEqual(null);
        });

        it('should return an error message for "inCareOf" if its over the character limit', () => {
          const entity = new ContactUpdated(
            {
              ...VALID_ENTITY,
              inCareOf: 'a'.repeat(101),
            },
            CONTACT_NAME,
            PETITION_TYPE,
            PARTY_TYPE,
          );

          const errors = entity.getFormattedValidationErrors();
          expect(errors).toEqual({
            inCareOf:
              '"inCareOf" length must be less than or equal to 100 characters long',
          });
        });
      });

      describe('name', () => {
        it('should return an error message for "name" if its undefined', () => {
          const entity = new ContactUpdated(
            {
              ...VALID_ENTITY,
              name: undefined,
            },
            CONTACT_NAME,
            PETITION_TYPE,
            PARTY_TYPE,
          );

          const errors = entity.getFormattedValidationErrors();
          expect(errors).toEqual({ name: 'Enter name' });
        });

        it('should return an error message for "name" if its over the character limit', () => {
          const entity = new ContactUpdated(
            {
              ...VALID_ENTITY,
              name: 'a'.repeat(101),
            },
            CONTACT_NAME,
            PETITION_TYPE,
            PARTY_TYPE,
          );

          const errors = entity.getFormattedValidationErrors();
          expect(errors).toEqual({ name: 'Enter name' });
        });
      });

      describe('phone', () => {
        it('should return an error message for "phone" if its undefined', () => {
          const entity = new ContactUpdated(
            {
              ...VALID_ENTITY,
              phone: undefined,
            },
            CONTACT_NAME,
            PETITION_TYPE,
            PARTY_TYPE,
          );

          const errors = entity.getFormattedValidationErrors();
          expect(errors).toEqual({ phone: 'Enter phone number' });
        });

        it('should return an error message for "phone" if its over the character limit', () => {
          const entity = new ContactUpdated(
            {
              ...VALID_ENTITY,
              phone: 'a'.repeat(101),
            },
            CONTACT_NAME,
            PETITION_TYPE,
            PARTY_TYPE,
          );

          const errors = entity.getFormattedValidationErrors();
          expect(errors).toEqual({ phone: 'Enter phone number' });
        });
      });

      describe('placeOfLegalResidence', () => {
        it('should not return an error message for "placeOfLegalResidence" if its undefined and "petitionType" is autoGenerated', () => {
          const TEST_PETITION_TYPE = 'autoGenerated';
          const entity = new ContactUpdated(
            {
              ...VALID_ENTITY,
              petitionType: TEST_PETITION_TYPE,
              placeOfLegalResidence: undefined,
            },
            CONTACT_NAME,
            TEST_PETITION_TYPE,
            PARTY_TYPE,
          );

          const errors = entity.getFormattedValidationErrors();
          expect(errors).toEqual(null);
        });

        it('should not return an error message for "placeOfLegalResidence" if its undefined and "petitionType" is not autoGenerated', () => {
          const TEST_PETITION_TYPE = 'SOMETHING_ELSE';
          const entity = new ContactUpdated(
            {
              ...VALID_ENTITY,
              petitionType: TEST_PETITION_TYPE,
              placeOfLegalResidence: undefined,
            },
            CONTACT_NAME,
            TEST_PETITION_TYPE,
            PARTY_TYPE,
          );

          const errors = entity.getFormattedValidationErrors();
          expect(errors).toEqual(null);
        });

        it('should return an error message for "placeOfLegalResidence" if its an invalid choice', () => {
          const entity = new ContactUpdated(
            {
              ...VALID_ENTITY,
              petitionType: PETITION_TYPE,
              placeOfLegalResidence: 'RANDOM_OPTION',
            },
            CONTACT_NAME,
            PETITION_TYPE,
            PARTY_TYPE,
          );

          const errors = entity.getFormattedValidationErrors();
          expect(errors).toEqual({
            placeOfLegalResidence: 'Enter a place of legal residence',
          });
        });
      });

      describe('paperPetitionEmail', () => {
        it('should not return an error message for "paperPetitionEmail" if its undefined', () => {
          const entity = new ContactUpdated(
            {
              ...VALID_ENTITY,
              paperPetitionEmail: undefined,
            },
            CONTACT_NAME,
            PETITION_TYPE,
            PARTY_TYPE,
          );

          const errors = entity.getFormattedValidationErrors();
          expect(errors).toEqual(null);
        });

        it('should return an error message for "paperPetitionEmail" if it is not a valid email format', () => {
          const entity = new ContactUpdated(
            {
              ...VALID_ENTITY,
              paperPetitionEmail: 'Iceland',
            },
            CONTACT_NAME,
            PETITION_TYPE,
            PARTY_TYPE,
          );

          const errors = entity.getFormattedValidationErrors();
          expect(errors).toEqual({
            paperPetitionEmail:
              'Enter email address in format: yourname@example.com',
          });
        });
      });
    });

    describe('DOMESTIC', () => {
      describe('postalCode', () => {
        it('should return an error message for "postalCode" if its undefined', () => {
          const entity = new ContactUpdated(
            {
              ...VALID_ENTITY,
              countryType: COUNTRY_TYPES.DOMESTIC,
              postalCode: undefined,
            },
            CONTACT_NAME,
            PETITION_TYPE,
            PARTY_TYPE,
          );

          const errors = entity.getFormattedValidationErrors();
          expect(errors).toEqual({ postalCode: 'Enter a valid ZIP code' });
        });

        it('should return an error message for "postalCode" if it does not match regex', () => {
          const entity = new ContactUpdated(
            {
              ...VALID_ENTITY,
              countryType: COUNTRY_TYPES.DOMESTIC,
              postalCode: 'SOMETHING_RANDOM',
            },
            CONTACT_NAME,
            PETITION_TYPE,
            PARTY_TYPE,
          );

          const errors = entity.getFormattedValidationErrors();
          expect(errors).toEqual({ postalCode: 'Enter a valid ZIP code' });
        });
      });

      describe('state', () => {
        it('should return an error message for "state" if its undefined', () => {
          const entity = new ContactUpdated(
            {
              ...VALID_ENTITY,
              countryType: COUNTRY_TYPES.DOMESTIC,
              state: undefined,
            },
            CONTACT_NAME,
            PETITION_TYPE,
            PARTY_TYPE,
          );

          const errors = entity.getFormattedValidationErrors();
          expect(errors).toEqual({ state: 'Enter state' });
        });

        it('should return an error message for "state" if its an invalid choice', () => {
          const entity = new ContactUpdated(
            {
              ...VALID_ENTITY,
              countryType: COUNTRY_TYPES.DOMESTIC,
              state: 'SOMETHING_RANDOM',
            },
            CONTACT_NAME,
            PETITION_TYPE,
            PARTY_TYPE,
          );

          const errors = entity.getFormattedValidationErrors();
          expect(errors).toEqual({ state: 'Enter state' });
        });
      });
    });

    describe('INTERNATIONAL', () => {
      describe('country', () => {
        it('should return an error message for "country" if its undefined', () => {
          const entity = new ContactUpdated(
            {
              ...VALID_ENTITY,
              country: undefined,
              countryType: COUNTRY_TYPES.INTERNATIONAL,
            },
            CONTACT_NAME,
            PETITION_TYPE,
            PARTY_TYPE,
          );

          const errors = entity.getFormattedValidationErrors();
          expect(errors).toEqual({ country: 'Enter a country' });
        });

        it('should return an error message for "country" if its over the character limit', () => {
          const entity = new ContactUpdated(
            {
              ...VALID_ENTITY,
              country: 'a'.repeat(501),
              countryType: COUNTRY_TYPES.INTERNATIONAL,
            },
            CONTACT_NAME,
            PETITION_TYPE,
            PARTY_TYPE,
          );

          const errors = entity.getFormattedValidationErrors();
          expect(errors).toEqual({ country: 'Enter a country' });
        });
      });

      describe('postalCode', () => {
        it('should return an error message for "postalCode" if its undefined', () => {
          const entity = new ContactUpdated(
            {
              ...VALID_ENTITY,
              countryType: COUNTRY_TYPES.INTERNATIONAL,
              postalCode: undefined,
            },
            CONTACT_NAME,
            PETITION_TYPE,
            PARTY_TYPE,
          );

          const errors = entity.getFormattedValidationErrors();
          expect(errors).toEqual({ postalCode: 'Enter postal code' });
        });

        it('should return an error message for "postalCode" if its over the character limit', () => {
          const entity = new ContactUpdated(
            {
              ...VALID_ENTITY,
              countryType: COUNTRY_TYPES.INTERNATIONAL,
              postalCode: 'a'.repeat(101),
            },
            CONTACT_NAME,
            PETITION_TYPE,
            PARTY_TYPE,
          );

          const errors = entity.getFormattedValidationErrors();
          expect(errors).toEqual({ postalCode: 'Enter postal code' });
        });
      });
    });
  });
});
