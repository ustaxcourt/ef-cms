const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  orderPublicSearchInteractor,
} = require('./orderPublicSearchInteractor');
const { ORDER_EVENT_CODES } = require('../../entities/EntityConstants');

describe('orderPublicSearchInteractor', () => {
  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch.mockResolvedValue([
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
        {
          caseCaption: 'Samson Workman, Petitioner',
          docketNumber: '103-19',
          docketNumberSuffix: 'AAB',
          documentTitle: 'Order for KitKats',
          eventCode: 'ODD',
          favoriteIceCream: 'Rocky Road',
          signedJudgeName: 'Guy Fieri',
        },
      ]);
  });

  it('should only search for order document types', async () => {
    const result = await orderPublicSearchInteractor({
      applicationContext,
      keyword: 'fish',
      startDate: '2001-01-01',
    });

    expect(
      applicationContext.getPersistenceGateway().advancedDocumentSearch.mock
        .calls[0][0],
    ).toMatchObject({
      documentEventCodes: ORDER_EVENT_CODES,
      omitSealed: true,
    });
    expect(result).toMatchObject([
      {
        docketNumber: '102-19',
        documentTitle: 'Order for More Candy',
        eventCode: 'ODD',
        isSealed: false,
      },
      {
        docketNumber: '103-19',
        documentTitle: 'Order for KitKats',
        eventCode: 'ODD',
        isSealed: false,
      },
    ]);
  });

  it('should throw an exception if a sealed order is returned', async () => {
    applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch.mockResolvedValueOnce([
        {
          caseCaption: 'Samson Workman, Petitioner',
          docketNumber: '103-19',
          docketNumberSuffix: 'AAA',
          documentTitle: 'Order for KitKats',
          eventCode: 'ODD',
          isSealed: true, // should never come back from public document search
          signedJudgeName: 'Guy Fieri',
        },
      ]);

    await expect(
      orderPublicSearchInteractor({
        applicationContext,
        keyword: 'KitKat',
        startDate: '2001-01-01',
      }),
    ).rejects.toThrow("'isSealed' contains an invalid value");
  });
});
