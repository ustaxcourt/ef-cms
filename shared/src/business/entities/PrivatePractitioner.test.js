const { PrivatePractitioner } = require('./PrivatePractitioner');
const { User } = require('./User');

describe('PrivatePractitioner', () => {
  it('Creates a valid PrivatePractitioner', () => {
    const user = new PrivatePractitioner({
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
      role: User.ROLES.privatePractitioner,
      userId: 'petitioner',
    });

    expect(user.isValid()).toBeTruthy();
    expect(user.entityName).toEqual('PrivatePractitioner');
  });

  it('Creates an invalid', () => {
    const user = new PrivatePractitioner({
      role: User.ROLES.irsPractitioner,
    });
    expect(user.isValid()).toBeFalsy();
  });
});
