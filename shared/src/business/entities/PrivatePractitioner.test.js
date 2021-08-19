const {
  COUNTRY_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} = require('./EntityConstants');
const { PrivatePractitioner } = require('./PrivatePractitioner');

describe('PrivatePractitioner', () => {
  it('Creates a valid PrivatePractitioner', () => {
    const user = new PrivatePractitioner({
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

  it('should populate firmName when one is provided', () => {
    const mockFirmName = 'Saul Goodman & Associates';

    const user = new PrivatePractitioner({
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
      firmName: mockFirmName,
      name: 'Saul Goodman',
      role: ROLES.privatePractitioner,
      userId: '3ab77c88-1dd0-4adb-a03c-c466ad72d417',
    });

    expect(user.firmName).toBe(mockFirmName);
    expect(user.isValid()).toBeTruthy();
  });

  it('should default the serviceIndicator to paper if the user does not have an email address and no serviceIndicator value is already set', () => {
    const user = new PrivatePractitioner({
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
      employer: 'Private',
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
    const user = new PrivatePractitioner({
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
      email: 'test.private.practitioner@example.com',
      employer: 'Private',
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
    const user = new PrivatePractitioner({
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
      email: 'test.private.practitioner@example.com',
      employer: 'Private',
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

  it('should filter out pendingEmailVerificationToken when filtered is true', () => {
    const user = new PrivatePractitioner(
      {
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
        pendingEmailVerificationToken: 'aab77c88-1dd0-4adb-a03c-c466ad72d417',
        role: ROLES.privatePractitioner,
        userId: '3ab77c88-1dd0-4adb-a03c-c466ad72d417',
      },
      { filtered: true },
    );

    expect(user.pendingEmailVerificationToken).toBeUndefined();
  });

  describe('isRepresenting', () => {
    const mockContactId = '2befbc59-3d02-4268-8c6e-d71a855fea92';
    const mockOtherContactId = '205cdd73-9eed-44c0-9c73-5801865ffb4b';

    it('returns true when the pracitioner represents the petitioner contactId provided', () => {
      const user = new PrivatePractitioner(
        {
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
          pendingEmailVerificationToken: 'aab77c88-1dd0-4adb-a03c-c466ad72d417',
          representing: [mockContactId],
          role: ROLES.privatePractitioner,
          userId: '3ab77c88-1dd0-4adb-a03c-c466ad72d417',
        },
        { filtered: true },
      );

      expect(user.isRepresenting(mockContactId)).toBeTruthy();
    });

    it('returns false when the pracitioner does not represent the petitioner contactId provided', () => {
      const user = new PrivatePractitioner(
        {
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
          pendingEmailVerificationToken: 'aab77c88-1dd0-4adb-a03c-c466ad72d417',
          representing: [mockContactId],
          role: ROLES.privatePractitioner,
          userId: '3ab77c88-1dd0-4adb-a03c-c466ad72d417',
        },
        { filtered: true },
      );

      expect(user.isRepresenting(mockOtherContactId)).toBeFalsy();
    });
  });
});
