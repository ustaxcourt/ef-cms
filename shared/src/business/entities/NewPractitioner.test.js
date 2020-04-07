const { NewPractitioner } = require('./NewPractitioner');
const { User } = require('./User');

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
        countryType: 'international',
        phone: '+1 (555) 555-5555',
        postalCode: '61234',
        state: 'IL',
      },
      email: 'test@example.com',
      employer: 'Private',
      firmName: 'GW Law Offices',
      firstName: 'Test',
      lastName: 'Practitioner',
      originalBarState: 'Illinois',
      practitionerType: 'Attorney',
      role: User.ROLES.NewPractitioner,
    });
    expect(user.isValid()).toBeTruthy();
  });

  it('Creates an invalid NewPractitioner with missing required fields', () => {
    const user = new NewPractitioner({
      role: User.ROLES.NewPractitioner,
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
        countryType: 'international',
        phone: '+1 (555) 555-5555',
        postalCode: '61234',
        state: 'IL',
      },
      email: 'test@example.com',
      employer: 'Private',
      firmName: 'GW Law Offices',
      originalBarState: 'Illinois',
      practitionerType: 'Attorney',
      role: User.ROLES.NewPractitioner,
    });
    expect(user.isValid()).toBeFalsy();
  });
});
