const {
  COUNTRY_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} = require('./EntityConstants');
const { over1000Characters } = require('../test/createTestApplicationContext');
const { Practitioner } = require('./Practitioner');

describe('Practitioner', () => {
  const mockUpdatedEmail = 'hello@example.com';
  const invalidEmail = 'hello@';
  let validPractitioner;

  const mockPractitioner = {
    admissionsDate: '2019-03-01',
    admissionsStatus: 'Active',
    barNumber: 'PT20001',
    birthYear: 2019,
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
    employer: 'Private',
    firmName: 'GW Law Offices',
    firstName: 'Test',
    lastName: 'Practitioner',
    name: 'Test Practitioner',
    originalBarState: 'IL',
    practitionerNotes: '',
    practitionerType: 'Attorney',
    role: ROLES.privatePractitioner,
    serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
    userId: 'ec4fe2e7-52cf-4084-84de-d8e8d151e927',
  };

  beforeEach(() => {
    validPractitioner = new Practitioner(mockPractitioner);
  });

  it('Creates a valid Practitioner with all required fields', () => {
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

  it('Creates an invalid Practitioner with missing required fields', () => {
    const user = new Practitioner({
      role: ROLES.Practitioner,
    });
    expect(user.isValid()).toBeFalsy();
  });

  it('Creates an invalid Practitioner with invalid employer option', () => {
    const user = new Practitioner({
      ...mockPractitioner,
      employer: 'Something else',
    });
    expect(user.isValid()).toBeFalsy();
  });

  it('Creates an invalid Practitioner with invalid practitionerType option', () => {
    const user = new Practitioner({
      ...mockPractitioner,
      practitionerType: 'Purple',
    });
    expect(user.isValid()).toBeFalsy();
  });

  it('Creates an invalid Practitioner with invalid admissionsStatus option', () => {
    const user = new Practitioner({
      ...mockPractitioner,
      admissionsStatus: 'Invalid',
    });
    expect(user.isValid()).toBeFalsy();
  });

  it('should fail validation when role is "inactivePractitioner" and admissionsStatus is Active', () => {
    const user = new Practitioner({
      admissionsStatus: 'Active',
      employer: 'IRS',
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

  it('should set the role to "irsPractitioner" when employer is "IRS" and admissionsStatus is Active', () => {
    const user = new Practitioner({
      admissionsStatus: 'Active',
      employer: 'IRS',
    });
    expect(user.role).toEqual(ROLES.irsPractitioner);
  });

  it('should set the role to "irsPractitioner" when employer is "DOJ" and admissionsStatus is Active', () => {
    const user = new Practitioner({
      admissionsStatus: 'Active',
      employer: 'DOJ',
    });
    expect(user.role).toEqual(ROLES.irsPractitioner);
  });

  it('should set the role to "privatePractitioner" when employer is "Private" and admissionsStatus is Active', () => {
    const user = new Practitioner({
      admissionsStatus: 'Active',
      employer: 'Private',
    });
    expect(user.role).toEqual(ROLES.privatePractitioner);
  });

  it('should set the role to "inactivePractitioner" when employer is "Private" and admissionsStatus is Inactive', () => {
    const user = new Practitioner({
      admissionsStatus: 'Inactive',
      employer: 'Private',
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
      practitionerNotes: over1000Characters,
    });

    expect(user.isValid()).toBeFalsy();
    expect(user.getFormattedValidationErrors()).toEqual({
      practitionerNotes:
        Practitioner.VALIDATION_ERROR_MESSAGES.practitionerNotes[0].message,
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
        confirmEmail:
          Practitioner.VALIDATION_ERROR_MESSAGES.confirmEmail[0].message,
        updatedEmail: Practitioner.VALIDATION_ERROR_MESSAGES.updatedEmail,
      });
    });

    it('fails validation when updatedEmail is defined and valid and confirmEmail is undefined', () => {
      validPractitioner.confirmEmail = undefined;
      validPractitioner.updatedEmail = mockUpdatedEmail;

      expect(validPractitioner.isValid()).toBeFalsy();
      expect(validPractitioner.getFormattedValidationErrors()).toEqual({
        confirmEmail:
          Practitioner.VALIDATION_ERROR_MESSAGES.confirmEmail[1].message,
      });
    });

    it('fails validation when updatedEmail is defined and valid and confirmEmail is not a valid email address', () => {
      validPractitioner.confirmEmail = invalidEmail;
      validPractitioner.updatedEmail = mockUpdatedEmail;

      expect(validPractitioner.isValid()).toBeFalsy();
      expect(validPractitioner.getFormattedValidationErrors()).toEqual({
        confirmEmail:
          Practitioner.VALIDATION_ERROR_MESSAGES.confirmEmail[1].message,
      });
    });

    it('fails validation when updatedEmail and confirmEmail do not match and both are valid', () => {
      validPractitioner.confirmEmail = 'abc' + mockUpdatedEmail;
      validPractitioner.updatedEmail = mockUpdatedEmail;

      expect(validPractitioner.isValid()).toBeFalsy();
      expect(validPractitioner.getFormattedValidationErrors()).toEqual({
        confirmEmail:
          Practitioner.VALIDATION_ERROR_MESSAGES.confirmEmail[0].message,
      });
    });

    it('should fail validation when updatedEmail is undefined and confirmEmail is a valid email address', () => {
      validPractitioner.confirmEmail = mockUpdatedEmail;
      validPractitioner.updatedEmail = undefined;

      expect(validPractitioner.isValid()).toBeFalsy();
      expect(validPractitioner.getFormattedValidationErrors()).toEqual({
        updatedEmail: Practitioner.VALIDATION_ERROR_MESSAGES.updatedEmail,
      });
    });

    it('should fail validation when updatedEmail is invalid and confirmEmail is undefined', () => {
      validPractitioner.confirmEmail = undefined;
      validPractitioner.updatedEmail = invalidEmail;

      expect(validPractitioner.isValid()).toBeFalsy();
      expect(validPractitioner.getFormattedValidationErrors()).toEqual({
        confirmEmail:
          Practitioner.VALIDATION_ERROR_MESSAGES.confirmEmail[1].message,
        updatedEmail: Practitioner.VALIDATION_ERROR_MESSAGES.updatedEmail,
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
