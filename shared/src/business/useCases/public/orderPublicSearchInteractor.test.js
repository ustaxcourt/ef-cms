const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  orderPublicSearchInteractor,
} = require('./orderPublicSearchInteractor');
const { Document } = require('../../entities/Document');
const { map } = require('lodash');

describe('orderPublicSearchInteractor', () => {
  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .orderKeywordSearch.mockResolvedValue([
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

  it('should only search for order document types', async () => {
    const expectedOrderEventCodes = map(
      Document.ORDER_DOCUMENT_TYPES,
      'eventCode',
    );

    await orderPublicSearchInteractor({
      applicationContext,
    });

    expect(
      applicationContext.getPersistenceGateway().orderKeywordSearch.mock
        .calls[0][0],
    ).toMatchObject({
      orderEventCodes: expectedOrderEventCodes,
    });
  });

  it('returns results with an authorized user role (petitionsclerk)', async () => {
    const result = await orderPublicSearchInteractor({
      applicationContext,
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
