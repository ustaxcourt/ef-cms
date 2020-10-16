const { marshallCase } = require('./marshallCase');
const { MOCK_CASE } = require('../../../../shared/src/test/mockCase');

describe('marshallCase', () => {
  it('returns a case object with the expected properties', () => {
    expect(Object.keys(marshallCase(MOCK_CASE)).sort()).toEqual([
      'caseCaption',
      'caseType',
      'contactPrimary',
      'contactSecondary',
      'docketEntries',
      'docketNumber',
      'docketNumberSuffix',
      'filingType',
      'leadDocketNumber',
      'noticeOfTrialDate',
      'partyType',
      'practitioners',
      'preferredTrialCity',
      'respondents',
      'sortableDocketNumber',
      'status',
      'trialLocation',
    ]);
  });

  it('marshalls from the current case format', () => {
    const mock = Object.assign({}, MOCK_CASE, {
      contactSecondary: Object.assign({}, MOCK_CASE.contactPrimary),
      docketEntries: [],
      docketNumber: '123-19L',
      docketNumberSuffix: 'L',
      irsPractitioners: [],
      leadDocketNumber: '122-19L',
      noticeOfTrialDate: '2019-12-08T00:00:00.000Z',
      privatePractitioners: [],
      sortableDocketNumber: 201900123,
      trialLocation: 'Woodstock, Connecticut',
    });

    expect(mock.caseCaption).toBeDefined();
    expect(mock.caseType).toBeDefined();
    expect(mock.docketNumber).toBeDefined();
    expect(mock.docketNumberSuffix).toBeDefined();
    expect(mock.filingType).toBeDefined();
    expect(mock.leadDocketNumber).toBeDefined();
    expect(mock.noticeOfTrialDate).toBeDefined();
    expect(mock.partyType).toBeDefined();
    expect(mock.preferredTrialCity).toBeDefined();
    expect(mock.sortableDocketNumber).toBeDefined();
    expect(mock.status).toBeDefined();
    expect(mock.trialLocation).toBeDefined();

    expect(mock.contactPrimary).toBeDefined();
    expect(mock.contactSecondary).toBeDefined();
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
    expect(marshalled.noticeOfTrialDate).toEqual(mock.noticeOfTrialDate);
    expect(marshalled.partyType).toEqual(mock.partyType);
    expect(marshalled.preferredTrialCity).toEqual(mock.preferredTrialCity);
    expect(marshalled.sortableDocketNumber).toEqual(mock.sortableDocketNumber);
    expect(marshalled.status).toEqual(mock.status);
    expect(marshalled.trialLocation).toEqual(mock.trialLocation);

    // Exact format asserted in other tests.
    expect(marshalled.contactPrimary).toBeDefined();
    expect(marshalled.contactSecondary).toBeDefined();
    expect(marshalled.docketEntries).toBeDefined();
    expect(marshalled.practitioners).toBeDefined();
    expect(marshalled.respondents).toBeDefined();
  });
});
