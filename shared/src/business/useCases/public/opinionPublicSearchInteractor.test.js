const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  opinionPublicSearchInteractor,
} = require('./opinionPublicSearchInteractor');
const { Document } = require('../../entities/Document');

describe('opinionPublicSearchInteractor', () => {
  const mockOpinionSearchResult = [
    {
      caseCaption: 'Reuben Blair, Petitioner',
      caseId: '24fcb050-9c95-4d69-a149-96acba0196b8',
      contactPrimary: {
        address1: '66 East Clarendon Parkway',
        address2: 'Ut culpa cum sint ',
        address3: 'In laboris hic volup',
        city: 'Omnis dignissimos at',
        countryType: 'domestic',
        email: 'petitioner',
        name: 'Reuben Blair',
        phone: '+1 (338) 996-7072',
        postalCode: '92017',
        serviceIndicator: 'Electronic',
        state: 'DC',
      },
      contactSecondary: {},
      docketNumber: '103-20',
      docketNumberSuffix: 'L',
      documentId: '6945cdff-fd12-422b-bf2c-63b792b7f618',
      documentTitle: 'Memorandum Opinion Judge Armen',
      filingDate: '2020-05-12T18:42:10.471Z',
      irsPractitioners: [],
      isSealed: false,
      numberOfPages: 1,
      privatePractitioners: [],
      signedJudgeName: 'Maurice B. Foley',
    },
  ];

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .opinionKeywordSearch.mockResolvedValue(mockOpinionSearchResult);
  });

  it('should only search for opinion document types', async () => {
    await opinionPublicSearchInteractor({
      applicationContext,
      opinionKeyword: 'fish',
    });

    expect(
      applicationContext.getPersistenceGateway().opinionKeywordSearch.mock
        .calls[0][0],
    ).toMatchObject({
      opinionEventCodes: Document.OPINION_DOCUMENT_TYPES,
    });
  });

  it('should return search results based on the supplied opinion keyword', async () => {
    const result = await opinionPublicSearchInteractor({
      applicationContext,
      opinionKeyword: 'memorandum',
    });

    expect(result).toEqual(mockOpinionSearchResult);
  });
});
