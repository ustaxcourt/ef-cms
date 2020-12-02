const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  casePublicSearchInteractor,
  isCaseVisibleToPublic,
} = require('./casePublicSearchInteractor');
const {
  DOCKET_NUMBER_SUFFIXES,
  PARTY_TYPES,
} = require('../../entities/EntityConstants');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('casePublicSearchInteractor', () => {
  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);
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

  it('strips out all sealed cases', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({ sealedDate: 'some date' });
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
      ]);

    const results = await casePublicSearchInteractor({
      applicationContext,
      petitionerName: 'test person',
    });

    expect(results.length).toEqual(0);
  });
});

describe('isCaseVisibleToPublic', () => {
  let mockCase = { ...MOCK_CASE };
  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(mockCase);
  });

  it('returns complete case details if case is not sealed', async () => {
    const results = await isCaseVisibleToPublic({
      applicationContext,
      docketNumber: '1234-56',
    });
    expect(results).toBeTruthy();
  });

  it('returns undefined if the case is sealed', async () => {
    mockCase.sealedDate = 'some date';
    const results = await isCaseVisibleToPublic({
      applicationContext,
      docketNumber: '1234-56',
    });
    expect(results).toBeFalsy();
  });
});
