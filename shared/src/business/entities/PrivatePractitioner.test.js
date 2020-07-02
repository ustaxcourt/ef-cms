const { COUNTRY_TYPES, ROLES } = require('./EntityConstants');
const { PrivatePractitioner } = require('./PrivatePractitioner');

describe('PrivatePractitioner', () => {
  it('Creates a valid PrivatePractitioner', () => {
    const user = new PrivatePractitioner({
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
      firstName: 'firstName',
      lastName: 'lastName',
      role: ROLES.privatePractitioner,
      userId: '3ab77c88-1dd0-4adb-a03c-c466ad72d417',
    });

    expect(user.isValid()).toBeTruthy();
    expect(user.entityName).toEqual('PrivatePractitioner');
  });

  it('Creates an invalid', () => {
    const user = new PrivatePractitioner({
      role: ROLES.irsPractitioner,
    });
    expect(user.isValid()).toBeFalsy();
  });
});
