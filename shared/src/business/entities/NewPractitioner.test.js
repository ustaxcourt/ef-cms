const { COUNTRY_TYPES, ROLES, US_STATES } = require('./EntityConstants');
const { NewPractitioner } = require('./NewPractitioner');

describe('NewPractitioner', () => {
  const mockPractitioner = {
    admissionsDate: '2019-03-01',
    admissionsStatus: 'Active',
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
    email: 'test@example.com',
    employer: 'Private',
    firmName: 'GW Law Offices',
    firstName: 'Test',
    lastName: 'Practitioner',
    originalBarState: US_STATES.IL,
    practitionerType: 'Attorney',
    role: ROLES.NewPractitioner,
  };

  it('Creates a valid NewPractitioner with all required fields', () => {
    const user = new NewPractitioner(mockPractitioner);

    expect(user.isValid()).toBeTruthy();
  });

  it('Creates an invalid NewPractitioner with missing required fields', () => {
    const user = new NewPractitioner({
      role: ROLES.NewPractitioner,
    });
    expect(user.isValid()).toBeFalsy();
  });

  it('Creates an invalid NewPractitioner with missing firstName and lastName', () => {
    const user = new NewPractitioner({
      ...mockPractitioner,
      firstName: undefined,
      lastName: undefined,
    });
    expect(user.isValid()).toBeFalsy();
  });

  describe('updating email', () => {
    const mockUpdatedEmail = 'hello@example.com';
    const invalidEmail = 'hello@';

    const validNewPractitioner = new NewPractitioner(mockPractitioner);

    it('passes validation when pendingEmail is undefined', () => {
      validNewPractitioner.pendingEmail = undefined;

      expect(validNewPractitioner.isValid()).toBeTruthy();
    });

    it('passes validation when pendingEmail and confirmEmail match', () => {
      validNewPractitioner.pendingEmail = mockUpdatedEmail;
      validNewPractitioner.confirmEmail = mockUpdatedEmail;

      expect(validNewPractitioner.isValid()).toBeTruthy();
    });

    it('fails validation when pendingEmail is not a valid email address', () => {
      validNewPractitioner.pendingEmail = invalidEmail;
      validNewPractitioner.confirmEmail = undefined;

      expect(validNewPractitioner.isValid()).toBeFalsy();
      expect(validNewPractitioner.getFormattedValidationErrors()).toEqual({
        confirmEmail:
          NewPractitioner.VALIDATION_ERROR_MESSAGES.confirmEmail[1].message,
        pendingEmail: NewPractitioner.VALIDATION_ERROR_MESSAGES.pendingEmail,
      });
    });

    it('fails validation when pendingEmail is defined and confirmEmail is undefined', () => {
      validNewPractitioner.pendingEmail = mockUpdatedEmail;
      validNewPractitioner.confirmEmail = undefined;

      expect(validNewPractitioner.isValid()).toBeFalsy();
      expect(validNewPractitioner.getFormattedValidationErrors()).toEqual({
        confirmEmail:
          NewPractitioner.VALIDATION_ERROR_MESSAGES.confirmEmail[1].message,
      });
    });

    it('fails validation when pendingEmail is defined and confirmEmail is not a valid email address', () => {
      validNewPractitioner.pendingEmail = mockUpdatedEmail;
      validNewPractitioner.confirmEmail = invalidEmail;

      expect(validNewPractitioner.isValid()).toBeFalsy();
      expect(validNewPractitioner.getFormattedValidationErrors()).toEqual({
        confirmEmail:
          NewPractitioner.VALIDATION_ERROR_MESSAGES.confirmEmail[1].message,
      });
    });

    it('fails validation when pendingEmail and confirmEmail do not match', () => {
      validNewPractitioner.pendingEmail = mockUpdatedEmail;
      validNewPractitioner.confirmEmail = 'abc' + mockUpdatedEmail;

      expect(validNewPractitioner.isValid()).toBeFalsy();
      expect(validNewPractitioner.getFormattedValidationErrors()).toEqual({
        confirmEmail:
          NewPractitioner.VALIDATION_ERROR_MESSAGES.confirmEmail[0].message,
      });
    });
  });
});
