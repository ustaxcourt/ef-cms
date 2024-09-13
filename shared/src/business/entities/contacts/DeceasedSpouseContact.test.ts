import { DeceasedSpouseContact } from '@shared/business/entities/contacts/DeceasedSpouseContact';

describe('DeceasedSpouseContact', () => {
  const VALID_ENTITY = {
    address1: 'TEST_ADDRESS_1',
    city: 'TEST_CITY',
    countryType: 'domestic',
    inCareOf: 'TEST_IN_CARE_OF',
    name: 'TEST_NAME',
    postalCode: '12345',
    state: 'CA',
  };
  const TEST_PETITION_TYPE = '';
  const PARTY_TYPE = '';

  it('should create a valid instance of "DeceasedSpouseContact" entity', () => {
    const entity = new DeceasedSpouseContact(
      VALID_ENTITY,
      TEST_PETITION_TYPE,
      PARTY_TYPE,
    );

    const errors = entity.getFormattedValidationErrors();
    expect(errors).toEqual(null);
  });

  describe('VALIDATION', () => {
    describe('paperPetitionEmail', () => {
      it('should return an error message for "paperPetitionEmail" when "hasConsentedToEService" is true', () => {
        const entity = new DeceasedSpouseContact(
          {
            ...VALID_ENTITY,
            hasConsentedToEService: true,
            paperPetitionEmail: undefined,
          },
          TEST_PETITION_TYPE,
          PARTY_TYPE,
        );

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual({
          paperPetitionEmail:
            'Enter an email address to register for electronic service',
        });
      });

      it('should not return an error message for "email" when "hasConsentedToEService" is false', () => {
        const entity = new DeceasedSpouseContact(
          {
            ...VALID_ENTITY,
            hasConsentedToEService: false,
            paperPetitionEmail: undefined,
          },
          TEST_PETITION_TYPE,
          PARTY_TYPE,
        );

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual(null);
      });

      it('should return an error message for "paperPetitionEmail" if not a valid email string', () => {
        const entity = new DeceasedSpouseContact(
          {
            ...VALID_ENTITY,
            hasConsentedToEService: true,
            paperPetitionEmail: 'not a valid email string',
          },
          TEST_PETITION_TYPE,
          PARTY_TYPE,
        );

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual({
          paperPetitionEmail:
            'Enter email address in format: yourname@example.com',
        });
      });
    });

    describe('hasConsentedToEService', () => {
      it('should not return an error message for "hasConsentedToEService" when it is undefined', () => {
        const entity = new DeceasedSpouseContact(
          {
            ...VALID_ENTITY,
            hasConsentedToEService: undefined,
          },
          TEST_PETITION_TYPE,
          PARTY_TYPE,
        );

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual(null);
      });
    });

    describe('inCareOf', () => {
      it('should return an error message for "inCareOf" when it is undefined', () => {
        const entity = new DeceasedSpouseContact(
          {
            ...VALID_ENTITY,
            inCareOf: undefined,
          },
          TEST_PETITION_TYPE,
          PARTY_TYPE,
        );

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual({ inCareOf: 'Enter name for in care of' });
      });

      it('should return an error message for "inCareOf" when it is an empty string', () => {
        const entity = new DeceasedSpouseContact(
          {
            ...VALID_ENTITY,
            inCareOf: '',
          },
          TEST_PETITION_TYPE,
          PARTY_TYPE,
        );

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual({ inCareOf: 'Enter name for in care of' });
      });

      it('should return an error message for "inCareOf" when it is over the length limit', () => {
        const entity = new DeceasedSpouseContact(
          {
            ...VALID_ENTITY,
            inCareOf: 'a'.repeat(101),
          },
          TEST_PETITION_TYPE,
          PARTY_TYPE,
        );

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual({ inCareOf: 'Enter name for in care of' });
      });
    });

    describe('phone', () => {
      it('should not return an error message for "phone" when it is undefined', () => {
        const entity = new DeceasedSpouseContact(
          {
            ...VALID_ENTITY,
            phone: undefined,
          },
          TEST_PETITION_TYPE,
          PARTY_TYPE,
        );

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual(null);
      });

      it('should not return an error message for "phone" when it is null', () => {
        const entity = new DeceasedSpouseContact(
          {
            ...VALID_ENTITY,
            phone: null,
          },
          TEST_PETITION_TYPE,
          PARTY_TYPE,
        );

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual(null);
      });

      it('should return an error message for "phone" when it is over the length limit', () => {
        const entity = new DeceasedSpouseContact(
          {
            ...VALID_ENTITY,
            phone: 'a'.repeat(101),
          },
          TEST_PETITION_TYPE,
          PARTY_TYPE,
        );

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual({
          phone:
            '"phone" length must be less than or equal to 100 characters long',
        });
      });
    });
  });
});
