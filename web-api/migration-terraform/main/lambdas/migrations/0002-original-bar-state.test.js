const {
  COUNTRY_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
  US_STATES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const { migrateItems } = require('./0002-original-bar-state');

describe('migrateItems', () => {
  const validPractitioner = {
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
    email: 'test.practitioner@example.com',
    employer: 'Private',
    firmName: 'GW Law Offices',
    firstName: 'Test',
    lastName: 'Practitioner',
    name: 'Test Practitioner',
    originalBarState: 'IL',
    practitionerNotes: '',
    practitionerType: 'Attorney',
    role: ROLES.privatePractitioner,
    serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
    userId: 'ec4fe2e7-52cf-4084-84de-d8e8d151e927',
  };

  it('should not update items that are not user records', () => {
    const items = [
      {
        pk: 'case|101-21',
        sk: 'user|ae3aff09-1e2e-43d0-a6bf-d43e2e4e0ff9',
      },
    ];

    const results = migrateItems(items);

    expect(results).toEqual(items);
  });

  it('should update privatePractitioner record originalBarState from full state name to abbreviation', () => {
    const testState = 'IL';

    const items = [
      {
        ...validPractitioner,
        originalBarState: US_STATES[testState],
        pk: 'user|ed10070b-ce23-46b4-9a34-4f500f768a98',
        role: ROLES.privatePractitioner,
        sk: 'user|ed10070b-ce23-46b4-9a34-4f500f768a98',
      },
    ];

    const results = migrateItems(items);

    expect(results[0]).toMatchObject({
      ...items[0],
      originalBarState: testState,
    });
  });

  it('should update privatePractitioner record originalBarState from lowercase abbreviation to uppercase abbreviation', () => {
    const items = [
      {
        ...validPractitioner,
        originalBarState: 'ny',
        pk: 'user|ed10070b-ce23-46b4-9a34-4f500f768a98',
        role: ROLES.privatePractitioner,
        sk: 'user|ed10070b-ce23-46b4-9a34-4f500f768a98',
      },
    ];

    const results = migrateItems(items);

    expect(results[0]).toMatchObject({
      ...items[0],
      originalBarState: 'NY',
    });
  });

  it('should update irsPractitioner record originalBarState from full state name to abbreviation', () => {
    const testState = 'TX';

    const items = [
      {
        ...validPractitioner,
        originalBarState: US_STATES[testState],
        pk: 'user|ed10070b-ce23-46b4-9a34-4f500f768a98',
        role: ROLES.irsPractitioner,
        sk: 'user|ed10070b-ce23-46b4-9a34-4f500f768a98',
      },
    ];

    const results = migrateItems(items);

    expect(results[0]).toMatchObject({
      ...items[0],
      originalBarState: testState,
    });
  });

  it('should update inactivePractitioner record originalBarState from full state name to abbreviation', () => {
    const testState = 'WY';

    const items = [
      {
        ...validPractitioner,
        admissionsStatus: 'Inactive',
        originalBarState: US_STATES[testState],
        pk: 'user|ed10070b-ce23-46b4-9a34-4f500f768a98',
        role: ROLES.inactivePractitioner,
        sk: 'user|ed10070b-ce23-46b4-9a34-4f500f768a98',
      },
    ];

    const results = migrateItems(items);

    expect(results[0]).toMatchObject({
      ...items[0],
      originalBarState: testState,
    });
  });

  it('should not update practitioner record if originalBarState is "N/A"', () => {
    const items = [
      {
        ...validPractitioner,
        originalBarState: 'N/A',
        pk: 'user|ed10070b-ce23-46b4-9a34-4f500f768a98',
        role: ROLES.inactivePractitioner,
        sk: 'user|ed10070b-ce23-46b4-9a34-4f500f768a98',
      },
    ];

    const results = migrateItems(items);

    expect(results).toEqual(items);
  });

  it('should not update practitioner record if originalBarState is a valid US_STATES_OTHER', () => {
    const items = [
      {
        ...validPractitioner,
        originalBarState: 'FM',
        pk: 'user|ed10070b-ce23-46b4-9a34-4f500f768a98',
        role: ROLES.inactivePractitioner,
        sk: 'user|ed10070b-ce23-46b4-9a34-4f500f768a98',
      },
    ];

    const results = migrateItems(items);

    expect(results).toEqual(items);
  });

  it("should set originalBarState to 'N/A' when originalBarState is not a valid state", async () => {
    const items = [
      {
        ...validPractitioner,
        originalBarState: 'An Invalid State',
        pk: 'user|ed10070b-ce23-46b4-9a34-4f500f768a98',
        role: ROLES.inactivePractitioner,
        sk: 'user|ed10070b-ce23-46b4-9a34-4f500f768a98',
      },
    ];

    const results = migrateItems(items);

    expect(results).toEqual([{ ...items[0], originalBarState: 'N/A' }]);
  });

  it("should set originalBarState to 'N/A' when originalBarState is undefined", async () => {
    const items = [
      {
        ...validPractitioner,
        originalBarState: undefined,
        pk: 'user|ed10070b-ce23-46b4-9a34-4f500f768a98',
        role: ROLES.inactivePractitioner,
        sk: 'user|ed10070b-ce23-46b4-9a34-4f500f768a98',
      },
    ];

    const results = migrateItems(items);

    expect(results).toEqual([{ ...items[0], originalBarState: 'N/A' }]);
  });

  it("should set originalBarState to 'FM' when originalBarState is 'TT", async () => {
    const items = [
      {
        ...validPractitioner,
        originalBarState: 'TT',
        pk: 'user|ed10070b-ce23-46b4-9a34-4f500f768a98',
        role: ROLES.inactivePractitioner,
        sk: 'user|ed10070b-ce23-46b4-9a34-4f500f768a98',
      },
    ];

    const results = migrateItems(items);

    expect(results).toEqual([{ ...items[0], originalBarState: 'FM' }]);
  });

  it("should set originalBarState to 'MP' when originalBarState is 'CM", async () => {
    const items = [
      {
        ...validPractitioner,
        originalBarState: 'CM',
        pk: 'user|ed10070b-ce23-46b4-9a34-4f500f768a98',
        role: ROLES.inactivePractitioner,
        sk: 'user|ed10070b-ce23-46b4-9a34-4f500f768a98',
      },
    ];

    const results = migrateItems(items);

    expect(results).toEqual([{ ...items[0], originalBarState: 'MP' }]);
  });
});
