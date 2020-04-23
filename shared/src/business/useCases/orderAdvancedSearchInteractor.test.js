const {
  orderAdvancedSearchInteractor,
} = require('./orderAdvancedSearchInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { Document } = require('../../business/entities/Document');

describe('orderAdvancedSearchInteractor', () => {
  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: 'petitionsclerk',
    });

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

  it('returns an unauthorized error on petitioner user role', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: 'petitioner',
    });

    await expect(
      orderAdvancedSearchInteractor({
        applicationContext,
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('returns results with an authorized user role (petitionsclerk)', async () => {
    const result = await orderAdvancedSearchInteractor({
      applicationContext,
      orderKeyword: 'candy',
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

  it('searches for documents that are of type orders', async () => {
    const orderKeyword = 'keyword';

    await orderAdvancedSearchInteractor({
      applicationContext,
      orderKeyword,
    });

    expect(
      applicationContext.getPersistenceGateway().orderKeywordSearch.mock
        .calls[0][0],
    ).toMatchObject({
      orderEventCodes: Document.ORDER_DOCUMENT_TYPES,
    });
  });
});
