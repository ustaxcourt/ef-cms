const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  DOCKET_NUMBER_SUFFIXES,
  PARTY_TYPES,
} = require('../../entities/EntityConstants');
const { casePublicSearchInteractor } = require('./casePublicSearchInteractor');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('casePublicSearchInteractor', () => {
  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .casePublicSearch.mockReturnValue([]);
  });

  it('returns empty array if no search params are passed in', async () => {
    const results = await casePublicSearchInteractor({
      applicationContext,
    });

    expect(results).toEqual([]);
  });

  it('should filter out sealed cases', async () => {
    applicationContext
      .getPersistenceGateway()
      .casePublicSearch.mockReturnValue([
        {
          caseCaption: 'Test Case Caption One',
          contactPrimary: MOCK_CASE.contactPrimary,
          docketNumber: '123-19',
          docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
          hasIrsPractitioner: false,
          partyType: PARTY_TYPES.petitioner,
          receivedAt: '2019-03-01T21:40:46.415Z',
        },
        {
          caseCaption: 'Test Case Caption Two',
          contactPrimary: MOCK_CASE.contactPrimary,
          docketNumber: '456-19',
          docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
          hasIrsPractitioner: false,
          partyType: PARTY_TYPES.petitioner,
          receivedAt: '2019-03-01T21:40:46.415Z',
        },
        {
          caseCaption: 'Sealed Case Caption Three',
          contactPrimary: MOCK_CASE.contactPrimary,
          docketNumber: '222-20',
          docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
          hasIrsPractitioner: false,
          partyType: PARTY_TYPES.petitioner,
          receivedAt: '2020-03-01T21:40:46.415Z',
          sealedDate: '2020-03-01T21:40:46.415Z',
        },
      ]);

    const results = await casePublicSearchInteractor({
      applicationContext,
      petitionerName: 'test person',
    });

    expect(results).toEqual([
      {
        caseCaption: 'Test Case Caption One',
        contactPrimary: {
          name: MOCK_CASE.contactPrimary.name,
          state: MOCK_CASE.contactPrimary.state,
        },
        contactSecondary: undefined,
        createdAt: undefined,
        docketEntries: [],
        docketNumber: '123-19',
        docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
        docketNumberWithSuffix: '123-19S',
        hasIrsPractitioner: false,
        isSealed: false,
        partyType: PARTY_TYPES.petitioner,
        receivedAt: '2019-03-01T21:40:46.415Z',
      },
      {
        caseCaption: 'Test Case Caption Two',
        contactPrimary: {
          name: MOCK_CASE.contactPrimary.name,
          state: MOCK_CASE.contactPrimary.state,
        },
        contactSecondary: undefined,
        createdAt: undefined,
        docketEntries: [],
        docketNumber: '456-19',
        docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
        docketNumberWithSuffix: '456-19S',
        hasIrsPractitioner: false,
        isSealed: false,
        partyType: PARTY_TYPES.petitioner,
        receivedAt: '2019-03-01T21:40:46.415Z',
      },
    ]);
  });

  it('only returns cases and filter our non case entities', async () => {
    applicationContext
      .getPersistenceGateway()
      .casePublicSearch.mockReturnValue([
        {
          caseCaption: 'Test Case Caption One',
          contactPrimary: MOCK_CASE.contactPrimary,
          docketNumber: '123-19',
          docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
          hasIrsPractitioner: false,
          partyType: PARTY_TYPES.petitioner,
          receivedAt: '2019-03-01T21:40:46.415Z',
        },
        {
          something: 'ABC',
        },
      ]);

    const results = await casePublicSearchInteractor({
      applicationContext,
      petitionerName: 'test person',
    });

    expect(results).toEqual([
      {
        caseCaption: 'Test Case Caption One',
        contactPrimary: {
          name: MOCK_CASE.contactPrimary.name,
          state: MOCK_CASE.contactPrimary.state,
        },
        contactSecondary: undefined,
        createdAt: undefined,
        docketEntries: [],
        docketNumber: '123-19',
        docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
        docketNumberWithSuffix: '123-19S',
        hasIrsPractitioner: false,
        isSealed: false,
        partyType: PARTY_TYPES.petitioner,
        receivedAt: '2019-03-01T21:40:46.415Z',
      },
    ]);
  });

  it('strips out all non public data', async () => {
    applicationContext
      .getPersistenceGateway()
      .casePublicSearch.mockReturnValue([
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

    const results = await casePublicSearchInteractor({
      applicationContext,
      petitionerName: 'test person',
    });

    expect(results).toEqual([
      {
        caseCaption: 'Test Case Caption One',
        contactPrimary: {
          name: MOCK_CASE.contactPrimary.name,
          state: MOCK_CASE.contactPrimary.state,
        },
        contactSecondary: undefined,
        createdAt: undefined,
        docketEntries: [],
        docketNumber: '123-19',
        docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
        docketNumberWithSuffix: '123-19S',
        hasIrsPractitioner: false,
        isSealed: false,
        partyType: PARTY_TYPES.petitioner,
        receivedAt: '2019-03-01T21:40:46.415Z',
      },
    ]);
  });
});
