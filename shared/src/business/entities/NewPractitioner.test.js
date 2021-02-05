const { COUNTRY_TYPES, ROLES, US_STATES } = require('./EntityConstants');
const { NewPractitioner } = require('./NewPractitioner');

describe('NewPractitioner', () => {
  it('Creates a valid NewPractitioner with all required fields', () => {
    const user = new NewPractitioner({
      admissionsDate: '2019-03-01T21:40:46.415Z',
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
    });

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
      admissionsDate: '2019-03-01T21:40:46.415Z',
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
      originalBarState: US_STATES.IL,
      practitionerType: 'Attorney',
      role: ROLES.NewPractitioner,
    });
    expect(user.isValid()).toBeFalsy();
  });

  describe.only('udpating emails', () => {
    const mockUpdatedEmail = 'hello@example.com';
    const invalidEmail = 'hello@';

    let user = new NewPractitioner({
      admissionsDate: '2019-03-01T21:40:46.415Z',
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
    });

    it('passes validation when updatedEmail is undefined', () => {
      user.updatedEmail = undefined;

      expect(user.isValid()).toBeTruthy();
    });

    it('passes validation when updatedEmail and confirmEmail match', () => {
      user.updatedEmail = mockUpdatedEmail;
      user.confirmEmail = mockUpdatedEmail;

      expect(user.isValid()).toBeTruthy();
    });

    it('fails validation when updatedEmail is not a valid email address', () => {
      user.updatedEmail = invalidEmail;

      expect(user.isValid()).toBeFalsy();
      expect(user.getFormattedValidationErrors()).toEqual({
        updatedEmail: 'Enter a valid email address',
      });
    });

    it('fails validation when updatedEmail is defined and confirmEmail is undefined', () => {
      user.updatedEmail = mockUpdatedEmail;
      user.confirmEmail = undefined;

      expect(user.isValid()).toBeFalsy();
      expect(user.getFormattedValidationErrors()).toEqual({
        updatedEmail: 'Enter a valid email address',
      });
    });

    it('fails validation when updatedEmail is defined and confirmEmail is not a valid email address', () => {});
    it('fails validation when updatedEmail and confirmEmail do not match', () => {});
  });
});
