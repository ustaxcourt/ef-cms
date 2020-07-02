const { COUNTRY_TYPES, ROLES } = require('./EntityConstants');
const { IrsPractitioner } = require('./IrsPractitioner');

describe('IrsPractitioner', () => {
  it('Creates a valid IrsPractitioner', () => {
    const user = new IrsPractitioner({
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
      role: ROLES.irsPractitioner,
      userId: '9ea9732c-9751-4159-9619-bd27556eb9bc',
    });

    expect(user.isValid()).toBeTruthy();
    expect(user.entityName).toEqual('IrsPractitioner');
  });

  it('Creates an invalid', () => {
    const user = new IrsPractitioner({
      role: ROLES.inactivePractitioner,
    });

    expect(user.isValid()).toBeFalsy();
  });
});
