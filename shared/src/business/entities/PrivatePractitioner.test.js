const {
  COUNTRY_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
  US_STATES,
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
      admissionsDate: '2019-03-01T21:40:46.415Z',
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
      originalBarState: US_STATES.IL,
      practitionerType: 'Attorney',
      role: ROLES.privatePractitioner,
      userId: 'ec4fe2e7-52cf-4084-84de-d8e8d151e927',
    });

    expect(user.serviceIndicator).toEqual(SERVICE_INDICATOR_TYPES.SI_PAPER);
  });

  it('should default the serviceIndicator to electronic if the user does have an email address and no serviceIndicator value is already set', () => {
    const user = new PrivatePractitioner({
      admissionsDate: '2019-03-01T21:40:46.415Z',
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
      originalBarState: US_STATES.IL,
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
      admissionsDate: '2019-03-01T21:40:46.415Z',
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
      originalBarState: US_STATES.IL,
      practitionerType: 'Attorney',
      role: ROLES.privatePractitioner,
      serviceIndicator: 'CARRIER_PIGEON',
      userId: 'ec4fe2e7-52cf-4084-84de-d8e8d151e927',
    });

    expect(user.serviceIndicator).toEqual('CARRIER_PIGEON');
  });

  describe('getRepresentingPrimary', () => {
    it('should return true if contactPrimary.contactId matches an id in the representing array', () => {
      const CONTACT_ID = '53887a7a-9dab-4c75-bab8-8225fb5e30a3';

      const privatePractitioner = new PrivatePractitioner({
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
        firmName: 'Saul Goodman & Associates',
        name: 'Saul Goodman',
        representing: [CONTACT_ID],
        role: ROLES.privatePractitioner,
        userId: '3ab77c88-1dd0-4adb-a03c-c466ad72d417',
      });

      const representingPrimary = privatePractitioner.getRepresentingPrimary({
        contactPrimary: { contactId: CONTACT_ID },
      });

      expect(representingPrimary).toBeTruthy();
    });

    it('should return false if contactPrimary.contactId does not match an id in the representing array', () => {
      const privatePractitioner = new PrivatePractitioner({
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
        firmName: 'Saul Goodman & Associates',
        name: 'Saul Goodman',
        representing: ['8ddd9bec-7a4a-4679-8edb-823fb2774530'],
        role: ROLES.privatePractitioner,
        userId: '3ab77c88-1dd0-4adb-a03c-c466ad72d417',
      });

      const representingPrimary = privatePractitioner.getRepresentingPrimary({
        contactPrimary: { contactId: '0fa1a4ac-1b91-4fc0-85bf-c0a22be411ad' },
      });

      expect(representingPrimary).toBeFalsy();
    });
  });

  describe('getRepresentingSecondary', () => {
    it('should return true if contactSecondary.contactId matches an id in the representing array', () => {
      const CONTACT_SECONDARY_ID = '53887a7a-9dab-4c75-bab8-8225fb5e30a3';

      const privatePractitioner = new PrivatePractitioner({
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
        firmName: 'Saul Goodman & Associates',
        name: 'Saul Goodman',
        representing: [CONTACT_SECONDARY_ID],
        role: ROLES.privatePractitioner,
        userId: '3ab77c88-1dd0-4adb-a03c-c466ad72d417',
      });

      const representingSecondary = privatePractitioner.getRepresentingSecondary(
        {
          contactPrimary: { contactId: '152732ec-4d31-4b9b-925b-2b746d9fbf08' },
          contactSecondary: { contactId: CONTACT_SECONDARY_ID },
        },
      );

      expect(representingSecondary).toBeTruthy();
    });

    it('should return false if contactSecondary.contactId does not match an id in the representing array', () => {
      const privatePractitioner = new PrivatePractitioner({
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
        firmName: 'Saul Goodman & Associates',
        name: 'Saul Goodman',
        representing: ['8ddd9bec-7a4a-4679-8edb-823fb2774530'],
        role: ROLES.privatePractitioner,
        userId: '3ab77c88-1dd0-4adb-a03c-c466ad72d417',
      });

      const representingSecondary = privatePractitioner.getRepresentingSecondary(
        {
          contactPrimary: { contactId: '0fa1a4ac-1b91-4fc0-85bf-c0a22be411ad' },
          contactSecondary: {
            contactId: '1add3e1d-d00d-4b37-83a9-ca5a6c9960a9',
          },
        },
      );

      expect(representingSecondary).toBeFalsy();
    });
  });
});
