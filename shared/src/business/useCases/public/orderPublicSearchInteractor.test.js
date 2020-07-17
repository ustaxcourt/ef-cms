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
          caseId: '1',
          docketNumber: '103-19',
          docketNumberSuffix: 'AAA',
          documentContents:
            'Everyone knows that Reeses Outrageous bars are the best candy',
          documentTitle: 'Order for More Candy',
          eventCode: 'ODD',
          signedJudgeName: 'Guy Fieri',
        },
        {
          caseCaption: 'Samson Workman, Petitioner',
          caseId: '2',
          docketNumber: '103-19',
          docketNumberSuffix: 'AAA',
          documentContents: 'KitKats are inferior candies',
          documentTitle: 'Order for KitKats',
          eventCode: 'ODD',
          signedJudgeName: 'Guy Fieri',
        },
        {
          caseCaption: 'Gal Fieri, Petitioner',
          caseId: '3',
          docketNumber: '104-19',
          docketNumberSuffix: 'AAA',
          documentContents: 'Baby Ruth is gross',
          documentTitle: 'Order for Baby Ruth',
          eventCode: 'ODD',
          isSealed: true,
          signedJudgeName: 'Gal Fieri',
        },
      ]);
  });

  it('should only search for order document types', async () => {
    await orderPublicSearchInteractor({
      applicationContext,
      keyword: 'fish',
    });

    expect(
      applicationContext.getPersistenceGateway().advancedDocumentSearch.mock
        .calls[0][0],
    ).toMatchObject({
      documentEventCodes: ORDER_EVENT_CODES,
    });
  });

  it('returns results with sealed cases filtered out', async () => {
    const result = await orderPublicSearchInteractor({
      applicationContext,
      keyword: 'fish',
    });

    expect(result).toMatchObject([
      {
        caseCaption: 'Samson Workman, Petitioner',
        caseId: '1',
        docketNumber: '103-19',
        docketNumberSuffix: 'AAA',
        documentContents:
          'Everyone knows that Reeses Outrageous bars are the best candy',
        documentTitle: 'Order for More Candy',
        eventCode: 'ODD',
        signedJudgeName: 'Guy Fieri',
      },
      {
        caseCaption: 'Samson Workman, Petitioner',
        caseId: '2',
        docketNumber: '103-19',
        docketNumberSuffix: 'AAA',
        documentContents: 'KitKats are inferior candies',
        documentTitle: 'Order for KitKats',
        eventCode: 'ODD',
        signedJudgeName: 'Guy Fieri',
      },
    ]);
  });
});
