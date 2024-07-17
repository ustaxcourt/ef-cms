import { SpouseContact } from '@shared/business/entities/contacts/SpouseContact';

describe('SpouseContact', () => {
  const VALID_ENTITY = {
    address1: 'TEST_ADDRESS_1',
    city: 'TEST_CITY',
    countryType: 'domestic',
    inCareOf: 'TEST_IN_CARE_OF',
    name: 'TEST_NAME',
    phone: 'TEST_PHONE',
    postalCode: '12345',
    secondaryName: 'TEST_SECONDARY_NAME',
    state: 'CA',
  };
  const TEST_PETITION_TYPE = 'TEST_PETITION_TYPE';
  const TEST_PARTY_TYPE = 'TEST_PARTY_TYPE';

  it('should create a valid instance of "SpouseContact" entity', () => {
    const entity = new SpouseContact(
      VALID_ENTITY,
      TEST_PETITION_TYPE,
      TEST_PARTY_TYPE,
    );

    const errors = entity.getFormattedValidationErrors();
    expect(errors).toEqual(null);
  });

  describe('VALIDATION', () => {
    describe('email', () => {
      it('should not return an error message for "email" when its undefined and "hasConsentedToEService" is false', () => {
        const entity = new SpouseContact(
          {
            ...VALID_ENTITY,
            email: undefined,
            hasConsentedToEService: false,
          },
          TEST_PETITION_TYPE,
          TEST_PARTY_TYPE,
        );

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual(null);
      });

      it('should  return an error message for "email" when its undefined and "hasConsentedToEService" is true', () => {
        const entity = new SpouseContact(
          {
            ...VALID_ENTITY,
            hasConsentedToEService: true,
            paperPetitionEmail: undefined,
          },
          TEST_PETITION_TYPE,
          TEST_PARTY_TYPE,
        );

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual({
          paperPetitionEmail:
            'Enter an email address to register for electronic service',
        });
      });
    });

    describe('hasConsentedToEService', () => {
      it('should not return an error message for "hasConsentedToEService" when its undefined', () => {
        const entity = new SpouseContact(
          {
            ...VALID_ENTITY,
            hasConsentedToEService: undefined,
          },
          TEST_PETITION_TYPE,
          TEST_PARTY_TYPE,
        );

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual(null);
      });
    });

    describe('phone', () => {
      it('should not return an error message for "phone" when its undefined', () => {
        const entity = new SpouseContact(
          {
            ...VALID_ENTITY,
            phone: undefined,
          },
          TEST_PETITION_TYPE,
          TEST_PARTY_TYPE,
        );

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual(null);
      });

      it('should return an error message for "phone" when its over the character limit', () => {
        const entity = new SpouseContact(
          {
            ...VALID_ENTITY,
            phone: 'a'.repeat(101),
          },
          TEST_PETITION_TYPE,
          TEST_PARTY_TYPE,
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
