const { Practitioner } = require('./Practitioner');

describe('Practitioner', () => {
  it('Creates a valid Practitioner', () => {
    const user = new Practitioner({
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
      role: 'petitioner',
      userId: 'taxpayer',
    });
    expect(user.isValid()).toBeTruthy();
  });

  it('Creates an invalid', () => {
    const user = new Practitioner({
      role: 'Practitioner',
    });
    expect(user.isValid()).toBeFalsy();
  });
});
