import {
  COUNTRY_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from './EntityConstants';
import { NewPractitioner, RawNewPractitioner } from './NewPractitioner';

describe('NewPractitioner', () => {
  const mockPractitioner: RawNewPractitioner = {
    admissionsDate: '2019-03-01',
    admissionsStatus: 'Active',
    birthYear: '2019',
    confirmEmail: 'test@example.com',
    contact: {
      address1: '234 Main St',
      address2: 'Apartment 4',
      address3: 'Under the stairs',
      city: 'Chicago',
      country: 'Brazil',
      countryType: COUNTRY_TYPES.INTERNATIONAL,
      phone: '+1 (555) 555-5555',
      postalCode: '61234',
      state: 'IL',
    },
    email: 'test@example.com',
    employer: 'Private',
    entityName: 'NewPractitioner',
    firmName: 'GW Law Offices',
    firstName: 'Test',
    lastName: 'Practitioner',
    originalBarState: 'IL',
    practitionerType: 'Attorney',
    role: ROLES.privatePractitioner,
    serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
  };

  it('should be valid when all required fields have been provided', () => {
    const user = new NewPractitioner(mockPractitioner);

    expect(user.isValid()).toBeTruthy();
  });

  it('should return validation errors and be invalid when required fields are missing', () => {
    const user = new NewPractitioner({
      email: undefined,
      role: ROLES.privatePractitioner, // Email is a required field
    });

    expect(user.isValid()).toBeFalsy();
    expect(user.getFormattedValidationErrors()).toMatchObject({
      email: 'Enter email address',
    });
  });

  it('should be invalid and return validation errors when firstName and lastName are missing', () => {
    const user = new NewPractitioner({
      ...mockPractitioner,
      firstName: undefined,
      lastName: undefined,
    });

    expect(user.isValid()).toBeFalsy();
    expect(user.getFormattedValidationErrors()).toMatchObject({
      firstName: 'Enter first name',
      lastName: 'Enter last name',
    });
  });

  describe('updating email', () => {
    const mockUpdatedEmail = 'hello@example.com';
    const invalidEmail = 'hello@';

    const validNewPractitioner = new NewPractitioner(mockPractitioner);

    it('should be valid when updatedEmail is undefined', () => {
      validNewPractitioner.updatedEmail = undefined;

      expect(validNewPractitioner.isValid()).toBeTruthy();
    });

    it('should be valid when email and confirmEmail match', () => {
      validNewPractitioner.email = mockUpdatedEmail;
      validNewPractitioner.confirmEmail = mockUpdatedEmail;

      expect(validNewPractitioner.isValid()).toBeTruthy();
    });

    it('should be invalid when email is not a valid email address', () => {
      validNewPractitioner.email = invalidEmail;
      validNewPractitioner.confirmEmail = undefined;

      expect(validNewPractitioner.isValid()).toBeFalsy();
      expect(validNewPractitioner.getFormattedValidationErrors()).toEqual({
        confirmEmail: 'Enter a valid email address',
        email: 'Enter email address',
      });
    });

    it('should be invalid when email is defined and confirmEmail is undefined', () => {
      validNewPractitioner.email = mockUpdatedEmail;
      validNewPractitioner.confirmEmail = undefined;

      expect(validNewPractitioner.isValid()).toBeFalsy();
      expect(validNewPractitioner.getFormattedValidationErrors()).toEqual({
        confirmEmail: 'Enter a valid email address',
      });
    });

    it('should be invalid when email is defined and confirmEmail is not a valid email address', () => {
      validNewPractitioner.email = mockUpdatedEmail;
      validNewPractitioner.confirmEmail = invalidEmail;

      expect(validNewPractitioner.isValid()).toBeFalsy();
      expect(validNewPractitioner.getFormattedValidationErrors()).toEqual({
        confirmEmail: 'Enter a valid email address',
      });
    });

    it('should be invalid when email and confirmEmail do not match', () => {
      validNewPractitioner.email = mockUpdatedEmail;
      validNewPractitioner.confirmEmail = 'abc' + mockUpdatedEmail;

      expect(validNewPractitioner.isValid()).toBeFalsy();
      expect(validNewPractitioner.getFormattedValidationErrors()).toEqual({
        confirmEmail: 'Email addresses do not match',
      });
    });
  });
});
