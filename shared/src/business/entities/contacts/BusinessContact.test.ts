import {
  BusinessContact,
  RawBusinessContact,
} from '@shared/business/entities/contacts/BusinessContact';
import {
  CONTACT_TYPES,
  COUNTRY_TYPES,
  PARTY_TYPES,
} from '@shared/business/entities/EntityConstants';

describe('BusinessContact', () => {
  const PETITION_TYPE = 'TEST_PETITION_TYPE';
  const PARTY_TYPE = PARTY_TYPES.partnershipAsTaxMattersPartner;

  const VALID_CONTACT_INFO: RawBusinessContact = {
    address1: 'TEST_ADDRESS_1',
    city: 'TEST_CITY',
    contactType: CONTACT_TYPES.petitioner,
    countryType: COUNTRY_TYPES.DOMESTIC,
    email: 'TEST@TEST.COM',
    name: 'TEST_NAME',
    partyType: PARTY_TYPE,
    petitionType: PETITION_TYPE,
    phone: 'TEST_PHONE',
    placeOfLegalResidence: 'CA',
    postalCode: '12345',
    secondaryName: 'TEST_SECONDARY_NAME',
    state: 'CA',
  };

  it('should create a valid instance of "BusinessContact" entity', () => {
    const entity = new BusinessContact(
      VALID_CONTACT_INFO,
      PETITION_TYPE,
      PARTY_TYPE,
    );

    expect(entity).toBeDefined();

    const errors = entity.getFormattedValidationErrors();
    expect(errors).toBe(null);
  });

  describe('VALIDATION', () => {
    describe('placeOfLegalResidence', () => {
      it('should not return an error message when "placeOfLegalResidence" is not defined and "petitionType" is not "autoGenerated"', () => {
        const TEST_PETITION_TYPE = 'SOMETHING_ELSE';
        const entity = new BusinessContact(
          {
            ...VALID_CONTACT_INFO,
            petitionType: TEST_PETITION_TYPE,
            placeOfLegalResidence: undefined,
          },
          TEST_PETITION_TYPE,
          PARTY_TYPE,
        );

        expect(entity).toBeDefined();

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toBe(null);
      });

      it('should not return an error message when "placeOfLegalResidence" is not defined and "petitionType" is "autoGenerated"', () => {
        const TEST_PETITION_TYPE = 'autoGenerated';
        const entity = new BusinessContact(
          {
            ...VALID_CONTACT_INFO,
            petitionType: TEST_PETITION_TYPE,
            placeOfLegalResidence: undefined,
          },
          TEST_PETITION_TYPE,
          PARTY_TYPE,
        );

        expect(entity).toBeDefined();

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual(null);
      });

      it('should return an error message when "placeOfLegalResidence" is not a valid option', () => {
        const TEST_PETITION_TYPE = 'autoGenerated';
        const entity = new BusinessContact(
          {
            ...VALID_CONTACT_INFO,
            petitionType: TEST_PETITION_TYPE,
            placeOfLegalResidence: 'INVALID_OPTION',
          },
          TEST_PETITION_TYPE,
          PARTY_TYPE,
        );

        expect(entity).toBeDefined();

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual({
          placeOfLegalResidence: 'Enter a place of business',
        });
      });

      it('should return an error message when "placeOfLegalResidence" is empty string', () => {
        const TEST_PETITION_TYPE = 'autoGenerated';
        const entity = new BusinessContact(
          {
            ...VALID_CONTACT_INFO,
            petitionType: TEST_PETITION_TYPE,
            placeOfLegalResidence: '',
          },
          TEST_PETITION_TYPE,
          PARTY_TYPE,
        );

        expect(entity).toBeDefined();

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual({
          placeOfLegalResidence: 'Enter a place of business',
        });
      });

      it('should not return an error message when "placeOfLegalResidence" is set to "Other"', () => {
        const TEST_PETITION_TYPE = 'autoGenerated';
        const entity = new BusinessContact(
          {
            ...VALID_CONTACT_INFO,
            petitionType: TEST_PETITION_TYPE,
            placeOfLegalResidence: 'Other',
          },
          TEST_PETITION_TYPE,
          PARTY_TYPE,
        );

        expect(entity).toBeDefined();

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toBe(null);
      });
    });

    describe('secondaryName', () => {
      it('should not return an error message when "secondaryName" is undefined and "partyType" is "Corporation"', () => {
        const TEST_PARTY_TYPE = PARTY_TYPES.corporation;
        const entity = new BusinessContact(
          {
            ...VALID_CONTACT_INFO,
            partyType: TEST_PARTY_TYPE,
            secondaryName: undefined,
          },
          PETITION_TYPE,
          TEST_PARTY_TYPE,
        );

        expect(entity).toBeDefined();

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toBe(null);
      });

      it('should return an error message when "secondaryName" is undefined and "partyType" is "partnershipAsTaxMattersPartner"', () => {
        const TEST_PARTY_TYPE = PARTY_TYPES.partnershipAsTaxMattersPartner;
        const entity = new BusinessContact(
          {
            ...VALID_CONTACT_INFO,
            partyType: TEST_PARTY_TYPE,
            secondaryName: undefined,
          },
          PETITION_TYPE,
          TEST_PARTY_TYPE,
        );

        expect(entity).toBeDefined();

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual({
          secondaryName: 'Enter Tax Matters Partner name',
        });
      });

      it('should return an error message when "secondaryName" is undefined and "partyType" is "partnershipBBA"', () => {
        const TEST_PARTY_TYPE = PARTY_TYPES.partnershipBBA;
        const entity = new BusinessContact(
          {
            ...VALID_CONTACT_INFO,
            partyType: TEST_PARTY_TYPE,
            secondaryName: undefined,
          },
          PETITION_TYPE,
          TEST_PARTY_TYPE,
        );

        expect(entity).toBeDefined();

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual({
          secondaryName: 'Enter partnership representative name',
        });
      });

      it('should return an error message when "secondaryName" is undefined and "partyType" is "partnershipOtherThanTaxMatters"', () => {
        const TEST_PARTY_TYPE = PARTY_TYPES.partnershipOtherThanTaxMatters;
        const entity = new BusinessContact(
          {
            ...VALID_CONTACT_INFO,
            partyType: TEST_PARTY_TYPE,
            secondaryName: undefined,
          },
          PETITION_TYPE,
          TEST_PARTY_TYPE,
        );

        expect(entity).toBeDefined();

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual({
          secondaryName: 'Enter name of partner',
        });
      });

      it('should return an error message when "secondaryName" is undefined and "partyType" is anything else', () => {
        const TEST_PARTY_TYPE = 'SOMETHING_ELSE';
        const entity = new BusinessContact(
          {
            ...VALID_CONTACT_INFO,
            partyType: TEST_PARTY_TYPE,
            secondaryName: undefined,
          },
          PETITION_TYPE,
          TEST_PARTY_TYPE,
        );

        expect(entity).toBeDefined();

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual({
          secondaryName: 'Enter secondary name',
        });
      });
    });
  });
});
