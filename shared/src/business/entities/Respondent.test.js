const { Respondent } = require('./Respondent');
const { User } = require('./User');

describe('Respondent', () => {
  it('Creates a valid respondent', () => {
    const user = new Respondent({
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
      firstName: 'firstName',
      lastName: 'lastName',
      role: User.ROLES.respondent,
      userId: 'petitioner',
    });
    expect(user.isValid()).toBeTruthy();
  });

  it('Creates an invalid', () => {
    const user = new Respondent({
      role: User.ROLES.respondent,
    });
    expect(user.isValid()).toBeFalsy();
  });
});
