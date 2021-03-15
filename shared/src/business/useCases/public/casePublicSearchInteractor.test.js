const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  DOCKET_NUMBER_SUFFIXES,
  MAX_SEARCH_RESULTS,
  PARTY_TYPES,
} = require('../../entities/EntityConstants');
const { casePublicSearchInteractor } = require('./casePublicSearchInteractor');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('casePublicSearchInteractor', () => {
  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);
    applicationContext
      .getPersistenceGateway()
      .casePublicSearchExactMatch.mockReturnValue([]);
  });

  it('returns empty array if no search params are passed in', async () => {
    const results = await casePublicSearchInteractor(applicationContext, {});

    expect(results).toEqual([]);
  });

  it('strips out all non public data', async () => {
    applicationContext
      .getPersistenceGateway()
      .casePublicSearchExactMatch.mockReturnValue([
        {
          caseCaption: 'Test Case Caption One',
          contactPrimary: MOCK_CASE.contactPrimary,
          docketNumber: '123-19',
          docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
          hasIrsPractitioner: false,
          internalFieldA: 'should be filtered out',
          internalFieldB: 'should be filtered out',
          internalFieldC: 'should be filtered out',
          partyType: PARTY_TYPES.petitioner,
          receivedAt: '2019-03-01T21:40:46.415Z',
        },
      ]);

    const results = await casePublicSearchInteractor(applicationContext, {
      petitionerName: 'test person',
    });

    expect(results).toEqual([
      {
        caseCaption: 'Test Case Caption One',
        contactPrimary: {
          entityName: 'PublicContact',
          name: MOCK_CASE.contactPrimary.name,
          state: MOCK_CASE.contactPrimary.state,
        },
        contactSecondary: undefined,
        createdAt: undefined,
        docketEntries: [],
        docketNumber: '123-19',
        docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
        docketNumberWithSuffix: '123-19S',
        entityName: 'PublicCase',
        hasIrsPractitioner: false,
        isSealed: false,
        partyType: PARTY_TYPES.petitioner,
        receivedAt: '2019-03-01T21:40:46.415Z',
      },
    ]);
  });

  it('returns no more than MAX_SEARCH_RESULTS', async () => {
    const maxPlusOneResults = new Array(MAX_SEARCH_RESULTS + 1).fill({
      caseCaption: 'Test Case Caption One',
      contactPrimary: MOCK_CASE.contactPrimary,
      docketNumber: '123-19',
      docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
      hasIrsPractitioner: false,
      internalFieldA: 'should be filtered out',
      internalFieldB: 'should be filtered out',
      internalFieldC: 'should be filtered out',
      partyType: PARTY_TYPES.petitioner,
      receivedAt: '2019-03-01T21:40:46.415Z',
    });
    applicationContext
      .getPersistenceGateway()
      .casePublicSearchExactMatch.mockResolvedValue(maxPlusOneResults);

    const results = await casePublicSearchInteractor(applicationContext, {});

    expect(results.length).toBe(MAX_SEARCH_RESULTS);
  });

  it('strips out all sealed cases', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({ sealedDate: 'some date' });
    applicationContext
      .getPersistenceGateway()
      .casePublicSearchExactMatch.mockReturnValue([
        {
          caseCaption: 'Test Case Caption One',
          contactPrimary: MOCK_CASE.contactPrimary,
          docketNumber: '123-19',
          docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
          hasIrsPractitioner: false,
          partyType: PARTY_TYPES.petitioner,
          receivedAt: '2019-03-01T21:40:46.415Z',
        },
      ]);

    const results = await casePublicSearchInteractor(applicationContext, {
      petitionerName: 'test person',
    });

    expect(results.length).toEqual(0);
  });
});
