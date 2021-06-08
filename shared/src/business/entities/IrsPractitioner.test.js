const {
  COUNTRY_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} = require('./EntityConstants');
const { IrsPractitioner } = require('./IrsPractitioner');

describe('IrsPractitioner', () => {
  it('Creates a valid IrsPractitioner', () => {
    const user = new IrsPractitioner({
      barNumber: 'BN1234',
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
      name: 'Saul Goodman',
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

  it('should default the serviceIndicator to paper if the user does not have an email address and no serviceIndicator value is already set', () => {
    const user = new IrsPractitioner({
      admissionsDate: '2019-03-01',
      admissionsStatus: 'Active',
      barNumber: 'PT20001',
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
      employer: 'IRS',
      firmName: 'GW Law Offices',
      firstName: 'Test',
      lastName: 'Practitioner',
      name: 'Test Practitioner',
      originalBarState: 'IL',
      practitionerType: 'Attorney',
      role: ROLES.privatePractitioner,
      userId: 'ec4fe2e7-52cf-4084-84de-d8e8d151e927',
    });

    expect(user.serviceIndicator).toEqual(SERVICE_INDICATOR_TYPES.SI_PAPER);
  });

  it('should default the serviceIndicator to electronic if the user does have an email address and no serviceIndicator value is already set', () => {
    const user = new IrsPractitioner({
      admissionsDate: '2019-03-01',
      admissionsStatus: 'Active',
      barNumber: 'PT20001',
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
      email: 'test.irs.practitioner@example.com',
      employer: 'IRS',
      firmName: 'GW Law Offices',
      firstName: 'Test',
      lastName: 'Practitioner',
      name: 'Test Practitioner',
      originalBarState: 'IL',
      practitionerType: 'Attorney',
      role: ROLES.privatePractitioner,
      userId: 'ec4fe2e7-52cf-4084-84de-d8e8d151e927',
    });

    expect(user.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );
  });

  it('should default the serviceIndicator to the already existing serviceIndicator value if present', () => {
    const user = new IrsPractitioner({
      admissionsDate: '2019-03-01',
      admissionsStatus: 'Active',
      barNumber: 'PT20001',
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
      email: 'test.irs.practitioner@example.com',
      employer: 'IRS',
      firmName: 'GW Law Offices',
      firstName: 'Test',
      lastName: 'Practitioner',
      name: 'Test Practitioner',
      originalBarState: 'IL',
      practitionerType: 'Attorney',
      role: ROLES.privatePractitioner,
      serviceIndicator: 'CARRIER_PIGEON',
      userId: 'ec4fe2e7-52cf-4084-84de-d8e8d151e927',
    });

    expect(user.serviceIndicator).toEqual('CARRIER_PIGEON');
  });

  it('should filter out pendingEmailVerificationToken if filtered is true', () => {
    const user = new IrsPractitioner(
      {
        admissionsDate: '2019-03-01',
        admissionsStatus: 'Active',
        barNumber: 'PT20001',
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
        email: 'test.irs.practitioner@example.com',
        employer: 'IRS',
        firmName: 'GW Law Offices',
        firstName: 'Test',
        lastName: 'Practitioner',
        name: 'Test Practitioner',
        originalBarState: 'IL',
        pendingEmailVerificationToken: 'ac4fe2e7-52cf-4084-84de-d8e8d151e927',
        practitionerType: 'Attorney',
        role: ROLES.privatePractitioner,
        serviceIndicator: 'CARRIER_PIGEON',
        userId: 'ec4fe2e7-52cf-4084-84de-d8e8d151e927',
      },
      { filtered: true },
    );

    expect(user.pendingEmailVerificationToken).toBeUndefined();
  });
});
