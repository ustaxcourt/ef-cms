const { Attorney } = require('./Attorney');
const { User } = require('./User');

describe('Attorney', () => {
  it('Creates a valid Attorney with all required fields', () => {
    const user = new Attorney({
      admissionsDate: '2019-03-01T21:40:46.415Z',
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
      employer: 'Private',
      isAdmitted: true,
      name: 'Test Practitioner',
      practitionerType: 'Attorney',
      role: User.ROLES.Practitioner,
      userId: 'practitioner',
    });
    expect(user.isValid()).toBeTruthy();
  });

  it('Creates an invalid Attorney with missing required fields', () => {
    const user = new Attorney({
      role: User.ROLES.Attorney,
    });
    expect(user.isValid()).toBeFalsy();
  });

  it('Creates an invalid Attorney with invalid employer option', () => {
    const user = new Attorney({
      admissionsDate: '2019-03-01T21:40:46.415Z',
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
      employer: 'Something else',
      isAdmitted: true,
      name: 'Test Practitioner',
      practitionerType: 'Attorney',
      role: User.ROLES.Practitioner,
      userId: 'practitioner',
    });
    expect(user.isValid()).toBeFalsy();
  });

  it('Creates an invalid Attorney with invalid practitionerType option', () => {
    const user = new Attorney({
      admissionsDate: '2019-03-01T21:40:46.415Z',
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
      employer: 'Something else',
      isAdmitted: true,
      name: 'Test Practitioner',
      practitionerType: 'Purple',
      role: User.ROLES.Practitioner,
      userId: 'practitioner',
    });
    expect(user.isValid()).toBeFalsy();
  });
});
