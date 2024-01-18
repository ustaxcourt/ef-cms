import {
  CONTACT_TYPES,
  COUNTRY_TYPES,
  SERVICE_INDICATOR_TYPES,
} from '../EntityConstants';
import { Petitioner } from './Petitioner';
import { applicationContext } from '../../test/createTestApplicationContext';
import { getTextByCount } from '../../utilities/getTextByCount';

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

  it('should throw an error when applicationContext is not provided to the importructor', () => {
    expect(() => new Petitioner(mockValidPetitioner, {} as any)).toThrow(
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
        serviceIndicator: 'Select a service indicator',
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
        name: 'Limit is 100 characters. Enter 100 or fewer characters.',
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
          'Limit is 200 characters. Enter 200 or fewer characters.',
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

  describe('optional fields', () => {
    it('should populate paperPetitionEmail when one is provided', () => {
      const mockEmail = 'petitioner@example.com';

      const entity = new Petitioner(
        {
          ...mockValidPetitioner,
          paperPetitionEmail: mockEmail,
        },
        { applicationContext },
      );

      expect(entity.paperPetitionEmail).toEqual(mockEmail);
    });

    it('should populate hasConsentedToEService when one is provided', () => {
      const mockHasConsentedToEService = false;

      const entity = new Petitioner(
        {
          ...mockValidPetitioner,
          hasConsentedToEService: mockHasConsentedToEService,
        },
        { applicationContext },
      );

      expect(entity.hasConsentedToEService).toEqual(mockHasConsentedToEService);
    });
  });
});
