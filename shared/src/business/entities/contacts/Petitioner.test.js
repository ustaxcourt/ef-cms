const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  CONTACT_TYPES,
  COUNTRY_TYPES,
  SERVICE_INDICATOR_TYPES,
} = require('../EntityConstants');
const {
  getTextByCount,
} = require('../../../../../web-client/integration-tests/helpers');
const { Petitioner } = require('./Petitioner');

describe('Petitioner', () => {
  const mockValidPetitioner = {
    address1: '1234 Some Street',
    city: 'Someplace',
    contactType: CONTACT_TYPES.primary,
    country: 'Uruguay',
    countryType: COUNTRY_TYPES.INTERNATIONAL,
    name: 'Juana Pereyra',
    phone: 'n/a',
    postalCode: '98123',
    serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
  };

  it('should throw an error when applicationContext is not provided to the constructor', () => {
    expect(() => new Petitioner(mockValidPetitioner, {})).toThrow(
      'applicationContext must be defined',
    );
  });

  describe('validate', () => {
    it('should be false when serviceIndicator is undefined', () => {
      const entity = new Petitioner(
        {
          ...mockValidPetitioner,
          serviceIndicator: undefined,
        },
        { applicationContext },
      );

      expect(entity.isValid()).toBe(false);
      expect(entity.getFormattedValidationErrors()).toEqual({
        serviceIndicator: Petitioner.VALIDATION_ERROR_MESSAGES.serviceIndicator,
      });
    });

    it('should be false when name field is too long', () => {
      const entity = new Petitioner(
        {
          ...mockValidPetitioner,
          name: getTextByCount(101),
        },
        { applicationContext },
      );

      expect(entity.isValid()).toBe(false);
      expect(entity.getFormattedValidationErrors()).toEqual({
        name: Petitioner.VALIDATION_ERROR_MESSAGES.name[0].message,
      });
    });

    it('should be false when additionalName field is too long', () => {
      const entity = new Petitioner(
        {
          ...mockValidPetitioner,
          additionalName: getTextByCount(601),
        },
        { applicationContext },
      );

      expect(entity.isValid()).toBe(false);
      expect(entity.getFormattedValidationErrors()).toEqual({
        additionalName:
          Petitioner.VALIDATION_ERROR_MESSAGES.additionalName[0].message,
      });
    });

    it('should be true when all required fields have been provided', () => {
      const entity = new Petitioner(mockValidPetitioner, {
        applicationContext,
      });

      expect(entity.isValid()).toBe(true);
      expect(entity.getFormattedValidationErrors()).toEqual(null);
    });

    it('should be false when title is longer than 100 chars', () => {
      const entity = new Petitioner(
        {
          ...mockValidPetitioner,
          title: getTextByCount(101),
        },
        { applicationContext },
      );

      expect(entity.isValid()).toBe(false);
      expect(entity.getFormattedValidationErrors()).toEqual({
        title:
          '"title" length must be less than or equal to 100 characters long',
      });
    });
  });

  describe('phone number formatting', () => {
    it('should format phone number string', () => {
      const entity = new Petitioner(
        {
          ...mockValidPetitioner,
          phone: '1234567890',
        },
        { applicationContext },
      );

      expect(entity.phone).toEqual('123-456-7890');
    });
  });
});
