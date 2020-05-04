const { IrsPractitioner } = require('./IrsPractitioner');
const { User } = require('./User');

describe('IrsPractitioner', () => {
  it('Creates a valid IrsPractitioner', () => {
    const user = new IrsPractitioner({
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
      role: User.ROLES.irsPractitioner,
      userId: 'petitioner',
    });
    console.log(user.getFormattedValidationErrors());
    expect(user.isValid()).toBeTruthy();
    expect(user.entityName).toEqual('IrsPractitioner');
  });

  it('Creates an invalid', () => {
    const user = new IrsPractitioner({
      role: User.ROLES.inactivePractitioner,
    });
    expect(user.isValid()).toBeFalsy();
  });
});
