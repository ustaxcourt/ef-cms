const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  opinionPublicSearchInteractor,
} = require('./opinionPublicSearchInteractor');
const { OPINION_EVENT_CODES } = require('../../entities/EntityConstants');

describe('opinionPublicSearchInteractor', () => {
  const mockOpinionSearchResult = [
    {
      caseCaption: 'Samson Workman, Petitioner',
      docketNumber: '102-19',
      docketNumberSuffix: 'AAA',
      documentContents:
        'Everyone knows that Reeses Outrageous bars are the best candy',
      documentTitle: 'Order for More Candy',
      eventCode: 'ODD',
      signedJudgeName: 'Guy Fieri',
    },
  ];

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch.mockResolvedValue(mockOpinionSearchResult);
  });

  it('should only search for opinion document types', async () => {
    await opinionPublicSearchInteractor({
      applicationContext,
      keyword: 'fish',
      startDate: '2001-01-01',
    });

    expect(
      applicationContext.getPersistenceGateway().advancedDocumentSearch.mock
        .calls[0][0],
    ).toMatchObject({
      documentEventCodes: OPINION_EVENT_CODES,
      omitSealed: true,
    });
  });

  it('should return search results based on the supplied opinion keyword', async () => {
    const result = await opinionPublicSearchInteractor({
      applicationContext,
      keyword: 'memorandum',
      startDate: '2001-01-01',
    });

    expect(result).toMatchObject([
      {
        docketNumber: '102-19',
        documentTitle: 'Order for More Candy',
        eventCode: 'ODD',
        isSealed: false,
      },
    ]);
  });

  it('should throw an error if search returns a sealed document to the call by the public interactor', async () => {
    applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch.mockResolvedValueOnce([
        { ...mockOpinionSearchResult, isSealed: true },
      ]);

    await expect(
      opinionPublicSearchInteractor({
        applicationContext,
        keyword: 'memorandum',
        startDate: '2001-01-01',
      }),
    ).rejects.toThrow("'isSealed' contains an invalid value");
  });
});
