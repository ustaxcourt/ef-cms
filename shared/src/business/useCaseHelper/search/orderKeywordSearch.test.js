const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { orderKeywordSearch } = require('./orderKeywordSearch');

describe('orderKeywordSearch', () => {
  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .orderKeywordSearch.mockReturnValue([]);
  });

  it('returns empty array when no search param is passed in', async () => {
    const results = await orderKeywordSearch({
      applicationContext,
    });

    expect(results).toEqual([]);
  });

  it('calls search function with correct params and returns records for a partial and exact match results', async () => {
    const mockKeywordForSearch = 'outrageous';

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
          pk: 'case|491b05b4-483f-4b85-8dd7-2dd4c069eb50',
          signedJudgeName: 'Guy Fieri',
          sk: 'document|8da3946f-f0e0-426e-a5bb-cb4c482fb737',
        },
        {
          caseCaption: 'Samson Workman, Petitioner',
          caseId: '2',
          docketNumber: '103-19',
          docketNumberSuffix: 'AAA',
          documentContents: 'KitKats are inferior candies',
          documentTitle: 'Order for KitKats',
          eventCode: 'ODD',
          pk: 'case|491b05b4-483f-4b85-8dd7-2dd4c069eb50',
          signedJudgeName: 'Guy Fieri',
          sk: 'document|8da3946f-f0e0-426e-a5bb-cb4c482fb737',
        },
      ]);
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockResolvedValue({
        caseCaption: 'Samson Workman, Petitioner',
        docketNumberSuffix: 'AAA',
      });

    const results = await orderKeywordSearch({
      applicationContext,
      orderKeyword: mockKeywordForSearch,
    });

    expect(results).toEqual([
      {
        caseCaption: 'Samson Workman, Petitioner',
        caseId: '1',
        docketNumber: '103-19',
        docketNumberSuffix: 'AAA',
        documentContents:
          'Everyone knows that Reeses Outrageous bars are the best candy',
        documentTitle: 'Order for More Candy',
        eventCode: 'ODD',
        pk: 'case|491b05b4-483f-4b85-8dd7-2dd4c069eb50',
        signedJudgeName: 'Guy Fieri',
        sk: 'document|8da3946f-f0e0-426e-a5bb-cb4c482fb737',
      },
      {
        caseCaption: 'Samson Workman, Petitioner',
        caseId: '2',
        docketNumber: '103-19',
        docketNumberSuffix: 'AAA',
        documentContents: 'KitKats are inferior candies',
        documentTitle: 'Order for KitKats',
        eventCode: 'ODD',
        pk: 'case|491b05b4-483f-4b85-8dd7-2dd4c069eb50',
        signedJudgeName: 'Guy Fieri',
        sk: 'document|8da3946f-f0e0-426e-a5bb-cb4c482fb737',
      },
    ]);
  });
});
