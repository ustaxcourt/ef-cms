const {
  applicationContext,
  over1000Characters,
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
  it('should throw an error when applicationContext is not provided to the constructor', () => {
    expect(
      () =>
        new Petitioner(
          {
            address1: '1234 Some Street',
            city: 'Someplace',
            country: 'Uruguay',
            countryType: COUNTRY_TYPES.INTERNATIONAL,
            name: 'Juana Pereyra',
            phone: 'n/a',
            postalCode: '98123',
            serviceIndicator: undefined,
          },
          {},
        ),
    ).toThrow('applicationContext must be defined');
  });

  describe('validate', () => {
    it('should be false when serviceIndicator is undefined', () => {
      const entity = new Petitioner(
        {
          address1: '1234 Some Street',
          city: 'Someplace',
          contactType: CONTACT_TYPES.primary,
          country: 'Uruguay',
          countryType: COUNTRY_TYPES.INTERNATIONAL,
          name: 'Juana Pereyra',
          phone: 'n/a',
          postalCode: '98123',
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
          address1: '1234 Some Street',
          city: 'Someplace',
          contactType: CONTACT_TYPES.primary,
          country: 'Uruguay',
          countryType: COUNTRY_TYPES.INTERNATIONAL,
          name: over1000Characters,
          phone: 'n/a',
          postalCode: '98123',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
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
          additionalName: over1000Characters,
          address1: '1234 Some Street',
          city: 'Someplace',
          contactType: CONTACT_TYPES.primary,
          country: 'Uruguay',
          countryType: COUNTRY_TYPES.INTERNATIONAL,
          name: 'Somebody Somewhere',
          phone: 'n/a',
          postalCode: '98123',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
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
      const entity = new Petitioner(
        {
          address1: '1234 Some Street',
          city: 'Someplace',
          contactType: CONTACT_TYPES.primary,
          country: 'Uruguay',
          countryType: COUNTRY_TYPES.INTERNATIONAL,
          name: 'Juana Pereyra',
          phone: 'n/a',
          postalCode: '98123',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        },
        { applicationContext },
      );

      expect(entity.isValid()).toBe(true);
      expect(entity.getFormattedValidationErrors()).toEqual(null);
    });

    it('should be false when title is longer than 100 chars', () => {
      const entity = new Petitioner(
        {
          address1: '1234 Some Street',
          city: 'Someplace',
          contactType: CONTACT_TYPES.primary,
          country: 'Uruguay',
          countryType: COUNTRY_TYPES.INTERNATIONAL,
          name: 'Juana Pereyra',
          phone: 'n/a',
          postalCode: '98123',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
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
});
