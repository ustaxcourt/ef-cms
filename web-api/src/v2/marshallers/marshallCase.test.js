const {
  CASE_STATUS_TYPES,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  SERVICE_INDICATOR_TYPES,
} = require('../../../../shared/src/business/entities/EntityConstants');
const { marshallCase } = require('./marshallCase');
const { MOCK_CASE } = require('../../../../shared/src/test/mockCase');

describe('marshallCase (which fails if version increase is needed, DO NOT CHANGE TESTS)', () => {
  const mock = Object.assign({}, MOCK_CASE, {
    docketEntries: [],
    docketNumber: '123-19L',
    docketNumberSuffix: 'L',
    irsPractitioners: [],
    leadDocketNumber: '122-19L',
    petitioners: [
      {
        address1: '123 Main St',
        city: 'Somewhere',
        contactId: '7805d1ab-18d0-43ec-bafb-654e83405416',
        contactType: CONTACT_TYPES.petitioner,
        countryType: COUNTRY_TYPES.DOMESTIC,
        email: 'petitioner1@example.com',
        name: 'First Petitioner',
        phone: '1234567',
        postalCode: '12345',
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        state: 'TN',
        title: 'Executor',
      },
      {
        address1: '123 Main St',
        city: 'Somewhere',
        contactId: '8805d1ab-18d0-43ec-bafb-654e83405416',
        contactType: CONTACT_TYPES.petitioner,
        countryType: COUNTRY_TYPES.DOMESTIC,
        email: 'petitioner2@example.com',
        name: 'Second Petitioner',
        phone: '1234567',
        postalCode: '12345',
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        state: 'TN',
        title: 'Executor',
      },
    ],
    privatePractitioners: [],
    sortableDocketNumber: 201900123,
    status: CASE_STATUS_TYPES.calendared,
    trialDate: '2019-12-08T00:00:00.000Z',
    trialLocation: 'Woodstock, Connecticut',
  });

  it('returns a case object with the expected properties', () => {
    expect(Object.keys(marshallCase(mock)).sort()).toEqual([
      'caseCaption',
      'caseType',
      'contactPrimary',
      'contactSecondary',
      'docketEntries',
      'docketNumber',
      'docketNumberSuffix',
      'filingType',
      'leadDocketNumber',
      'partyType',
      'practitioners',
      'preferredTrialCity',
      'respondents',
      'sortableDocketNumber',
      'status',
      'trialDate',
      'trialLocation',
    ]);
  });

  it('marshalls from the current case format', () => {
    expect(mock.caseCaption).toBeDefined();
    expect(mock.caseType).toBeDefined();
    expect(mock.docketNumber).toBeDefined();
    expect(mock.docketNumberSuffix).toBeDefined();
    expect(mock.filingType).toBeDefined();
    expect(mock.leadDocketNumber).toBeDefined();
    expect(mock.partyType).toBeDefined();
    expect(mock.preferredTrialCity).toBeDefined();
    expect(mock.sortableDocketNumber).toBeDefined();
    expect(mock.status).toBeDefined();
    expect(mock.trialDate).toBeDefined();
    expect(mock.trialLocation).toBeDefined();
    expect(mock.contactPrimary).not.toBeDefined();
    expect(mock.contactSecondary).not.toBeDefined();
    expect(mock.petitioners).toBeDefined();
    expect(mock.docketEntries).toBeDefined();
    expect(mock.irsPractitioners).toBeDefined();
    expect(mock.privatePractitioners).toBeDefined();

    const marshalled = marshallCase(mock);

    expect(marshalled.caseCaption).toEqual(mock.caseCaption);
    expect(marshalled.caseType).toEqual(mock.caseType);
    expect(marshalled.docketNumber).toEqual(mock.docketNumber);
    expect(marshalled.docketNumberSuffix).toEqual(mock.docketNumberSuffix);
    expect(marshalled.filingType).toEqual(mock.filingType);
    expect(marshalled.leadDocketNumber).toEqual(mock.leadDocketNumber);
    expect(marshalled.partyType).toEqual(mock.partyType);
    expect(marshalled.preferredTrialCity).toEqual(mock.preferredTrialCity);
    expect(marshalled.sortableDocketNumber).toEqual(mock.sortableDocketNumber);
    expect(marshalled.status).toEqual(mock.status);
    expect(marshalled.trialDate).toEqual(mock.trialDate);
    expect(marshalled.trialLocation).toEqual(mock.trialLocation);

    // Exact format asserted in other tests.
    expect(marshalled.contactPrimary).toBeDefined();
    expect(marshalled.contactSecondary).toBeDefined();
    expect(marshalled.docketEntries).toBeDefined();
    expect(marshalled.practitioners).toBeDefined();
    expect(marshalled.respondents).toBeDefined();
  });

  it('does not require any attributes to be set', () => {
    const marshalled = marshallCase({});
    expect(marshalled).toBeDefined();
  });
});
