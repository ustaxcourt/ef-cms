import {
  COUNTRY_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from './EntityConstants';
import { Practitioner, RawPractitioner } from './Practitioner';
import { getTextByCount } from '../utilities/getTextByCount';

describe('Practitioner', () => {
  let validPractitioner;

  const mockPractitioner: RawPractitioner = {
    admissionsDate: '2019-03-01',
    admissionsStatus: 'Active',
    barNumber: 'PT20001',
    birthYear: '2019',
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
    email: 'test.practitioner@example.com',
    entityName: 'Practitioner',
    firmName: 'GW Law Offices',
    firstName: 'Test',
    lastName: 'Practitioner',
    name: 'Test Practitioner',
    originalBarState: 'IL',
    practiceType: 'Private',
    practitionerNotes: '',
    practitionerType: 'Attorney',
    role: ROLES.privatePractitioner,
    section: ROLES.privatePractitioner,
    serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
    userId: 'ec4fe2e7-52cf-4084-84de-d8e8d151e927',
  };

  beforeEach(() => {
    validPractitioner = new Practitioner(mockPractitioner);
  });

  it('creates a valid Practitioner with all required fields', () => {
    const user = new Practitioner(mockPractitioner);

    expect(user.isValid()).toBeTruthy();
  });

  it('should filter out the pendingEmailVerificationToken when filtered is true', () => {
    const user = new Practitioner(
      {
        ...mockPractitioner,
        pendingEmailVerificationToken: 'aab77c88-1dd0-4adb-a03c-c466ad72d417',
      },
      { filtered: true },
    );

    expect(user.pendingEmailVerificationToken).toBeUndefined();
  });

  it('creates an invalid Practitioner with missing required fields', () => {
    const user = new Practitioner({
      role: ROLES.privatePractitioner,
    });

    expect(user.isValid()).toBeFalsy();
  });

  it('creates an invalid Practitioner with invalid practiceType option', () => {
    const user = new Practitioner({
      ...mockPractitioner,
      practiceType: 'Something else',
    });

    expect(user.isValid()).toBeFalsy();
  });

  it('creates an invalid Practitioner with invalid practitionerType option', () => {
    const user = new Practitioner({
      ...mockPractitioner,
      practitionerType: 'Purple',
    });

    expect(user.isValid()).toBeFalsy();
  });

  it('creates an invalid Practitioner with invalid admissionsStatus option', () => {
    const user = new Practitioner({
      ...mockPractitioner,
      admissionsStatus: 'Invalid',
    });

    expect(user.isValid()).toBeFalsy();
  });

  it('should fail validation when role is "inactivePractitioner" and admissionsStatus is Active', () => {
    const user = new Practitioner({
      admissionsStatus: 'Active',
      practiceType: 'IRS',
      role: ROLES.inactivePractitioner,
    });

    expect(user.isValid()).toBeFalsy();
  });

  it('should pass validation when role is "inactivePractitioner" and admissionsStatus is not Active', () => {
    const user = new Practitioner({
      ...mockPractitioner,
      admissionsStatus: 'Deceased',
      role: ROLES.inactivePractitioner,
    });

    expect(user.isValid()).toBeTruthy();
  });

  it('should pass validation when role is "privatePractitioner" and admissionsStatus is Active', () => {
    const user = new Practitioner({
      ...mockPractitioner,
      admissionsStatus: 'Active',
      role: ROLES.privatePractitioner,
    });

    expect(user.isValid()).toBeTruthy();
  });

  it('should set the role to "irsPractitioner" when practiceType is "IRS" and admissionsStatus is Active', () => {
    const user = new Practitioner({
      admissionsStatus: 'Active',
      practiceType: 'IRS',
    });

    expect(user.role).toEqual(ROLES.irsPractitioner);
  });

  it('should set the role to "irsPractitioner" when practiceType is "DOJ" and admissionsStatus is Active', () => {
    const user = new Practitioner({
      admissionsStatus: 'Active',
      practiceType: 'DOJ',
    });

    expect(user.role).toEqual(ROLES.irsPractitioner);
  });

  it('should set the role to "privatePractitioner" when practiceType is "Private" and admissionsStatus is Active', () => {
    const user = new Practitioner({
      admissionsStatus: 'Active',
      practiceType: 'Private',
    });

    expect(user.role).toEqual(ROLES.privatePractitioner);
  });

  it('should set the role to "inactivePractitioner" when practiceType is "Private" and admissionsStatus is Inactive', () => {
    const user = new Practitioner({
      admissionsStatus: 'Inactive',
      practiceType: 'Private',
    });

    expect(user.role).toEqual(ROLES.inactivePractitioner);
  });

  it('should pass validation when practitionerNotes is less than 500 characters', () => {
    const user = new Practitioner({
      ...mockPractitioner,
      practitionerNotes: 'Test notes',
    });

    expect(user.isValid()).toBeTruthy();
  });

  it('should fail validation when practitionerNotes is more than 500 characters', () => {
    const user = new Practitioner({
      ...mockPractitioner,
      practitionerNotes: getTextByCount(1001),
    });

    expect(user.isValid()).toBeFalsy();
    expect(user.getFormattedValidationErrors()).toEqual({
      practitionerNotes:
        'Limit is 500 characters. Enter 500 or fewer characters',
    });
  });

  it('Combines firstName, middleName, lastName, and suffix properties to set the name property', () => {
    const user = new Practitioner({
      ...mockPractitioner,
      firstName: 'Test',
      lastName: 'Practitioner',
      middleName: 'Middle',
      suffix: 'Sfx',
    });

    expect(user.name).toEqual('Test Middle Practitioner Sfx');
  });

  it('should default the serviceIndicator to paper if the user does not have an email address and no serviceIndicator value is already set', () => {
    const user = new Practitioner({
      ...mockPractitioner,
      email: undefined,
      serviceIndicator: undefined,
    });

    expect(user.serviceIndicator).toEqual(SERVICE_INDICATOR_TYPES.SI_PAPER);
  });

  it('should default the serviceIndicator to electronic if the user does have an email address and no serviceIndicator value is already set', () => {
    const user = new Practitioner({
      ...mockPractitioner,
      email: 'test.practitioner@example.com',
      serviceIndicator: undefined,
    });

    expect(user.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );
  });

  it('should default the serviceIndicator to the already existing serviceIndicator value if present', () => {
    const user = new Practitioner({
      ...mockPractitioner,
      serviceIndicator: 'CARRIER_PIGEON',
    });

    expect(user.serviceIndicator).toEqual('CARRIER_PIGEON');
  });

  describe('updatedEmail/confirmEmail', () => {
    const mockUpdatedEmail = 'hello@example.com';
    const invalidEmail = 'hello@';

    it('passes validation when updatedEmail and confirmEmail are undefined', () => {
      validPractitioner.updatedEmail = undefined;
      validPractitioner.confirmEmail = undefined;

      expect(validPractitioner.isValid()).toBeTruthy();
    });

    it('passes validation when updatedEmail and confirmEmail match and are valid email addresses', () => {
      validPractitioner.confirmEmail = mockUpdatedEmail;
      validPractitioner.updatedEmail = mockUpdatedEmail;

      expect(validPractitioner.isValid()).toBeTruthy();
    });

    it('fails validation when updatedEmail is not a valid email address and confirmEmail is a valid email address', () => {
      validPractitioner.confirmEmail = mockUpdatedEmail;
      validPractitioner.updatedEmail = invalidEmail;

      expect(validPractitioner.isValid()).toBeFalsy();
      expect(validPractitioner.getFormattedValidationErrors()).toEqual({
        confirmEmail: 'Email addresses do not match',
        updatedEmail: 'Enter email address in format: yourname@example.com',
      });
    });

    it('fails validation when updatedEmail is defined and valid and confirmEmail is undefined', () => {
      validPractitioner.confirmEmail = undefined;
      validPractitioner.updatedEmail = mockUpdatedEmail;

      expect(validPractitioner.isValid()).toBeFalsy();
      expect(validPractitioner.getFormattedValidationErrors()).toEqual({
        confirmEmail: 'Enter a valid email address',
      });
    });

    it('fails validation when updatedEmail is defined and valid and confirmEmail is not a valid email address', () => {
      validPractitioner.confirmEmail = invalidEmail;
      validPractitioner.updatedEmail = mockUpdatedEmail;

      expect(validPractitioner.isValid()).toBeFalsy();
      expect(validPractitioner.getFormattedValidationErrors()).toEqual({
        confirmEmail: 'Enter email address in format: yourname@example.com',
      });
    });

    it('fails validation when updatedEmail and confirmEmail do not match and both are valid', () => {
      validPractitioner.confirmEmail = 'abc' + mockUpdatedEmail;
      validPractitioner.updatedEmail = mockUpdatedEmail;

      expect(validPractitioner.isValid()).toBeFalsy();
      expect(validPractitioner.getFormattedValidationErrors()).toEqual({
        confirmEmail: 'Email addresses do not match',
      });
    });

    it('should fail validation when updatedEmail is undefined and confirmEmail is a valid email address', () => {
      validPractitioner.confirmEmail = mockUpdatedEmail;
      validPractitioner.updatedEmail = undefined;

      expect(validPractitioner.isValid()).toBeFalsy();
      expect(validPractitioner.getFormattedValidationErrors()).toEqual({
        updatedEmail: 'Enter a valid email address',
      });
    });

    it('should fail validation when updatedEmail is invalid and confirmEmail is undefined', () => {
      validPractitioner.confirmEmail = undefined;
      validPractitioner.updatedEmail = invalidEmail;

      expect(validPractitioner.isValid()).toBeFalsy();
      expect(validPractitioner.getFormattedValidationErrors()).toEqual({
        confirmEmail: 'Enter a valid email address',
        updatedEmail: 'Enter email address in format: yourname@example.com',
      });
    });
  });

  describe('getFullName', () => {
    it('should return the first and last names if only they are provided in the practitioner data', () => {
      expect(
        Practitioner.getFullName({
          firstName: 'Test',
          lastName: 'Practitioner',
        }),
      ).toEqual('Test Practitioner');
    });

    it('should return the first, middle, and last names if only they are provided in the practitioner data', () => {
      expect(
        Practitioner.getFullName({
          firstName: 'Test',
          lastName: 'Practitioner',
          middleName: 'Foo',
        }),
      ).toEqual('Test Foo Practitioner');
    });

    it('should return the first, middle, and last names with suffix if they are provided in the practitioner data', () => {
      expect(
        Practitioner.getFullName({
          firstName: 'Test',
          lastName: 'Practitioner',
          middleName: 'Foo',
          suffix: 'Bar',
        }),
      ).toEqual('Test Foo Practitioner Bar');
    });
  });

  describe('getDefaultServiceIndicator', () => {
    it('returns electronic when an email address is present in the given practitioner data', () => {
      expect(
        Practitioner.getDefaultServiceIndicator({
          email: 'test.practitioner@example.com',
        }),
      ).toEqual(SERVICE_INDICATOR_TYPES.SI_ELECTRONIC);
    });

    it('returns paper when an email address is NOT present in the given practitioner data', () => {
      expect(
        Practitioner.getDefaultServiceIndicator({ email: undefined }),
      ).toEqual(SERVICE_INDICATOR_TYPES.SI_PAPER);
    });
  });

  describe('toRawObject', () => {
    it('returns a raw practitioner object with updatedEmail and confirmEmail set to undefined', () => {
      const rawPractitionerObject = new Practitioner(
        validPractitioner,
      ).toRawObject();

      expect(rawPractitionerObject).toMatchObject({
        ...validPractitioner,
        confirmEmail: undefined,
        updatedEmail: undefined,
      });
    });
  });
});
