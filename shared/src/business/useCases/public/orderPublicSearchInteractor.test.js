const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  orderPublicSearchInteractor,
} = require('./orderPublicSearchInteractor');

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
