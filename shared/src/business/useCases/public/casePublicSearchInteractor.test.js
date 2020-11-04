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
