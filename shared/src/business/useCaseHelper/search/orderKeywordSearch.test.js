const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { map } = require('lodash');
const { Order } = require('../../entities/orders/Order');
const { orderKeywordSearch } = require('./orderKeywordSearch');

describe('orderKeywordSearch', () => {
  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: 'petitionsclerk',
    });
  });

  it('returns empty array when no search param is passed in', async () => {
    const results = await orderKeywordSearch({
      applicationContext,
    });

    expect(results).toEqual([]);
  });

  it('calls search function with correct params and returns records for a partial and exact match results', async () => {
    const mockKeywordForSearch = 'outrageous';
    const mockWildcardKeywordForSearch = '*outrageous*';
    const orderEventCodes = map(Order.ORDER_TYPES, 'eventCode');

    applicationContext.getSearchClient().search.mockResolvedValue({
      hits: {
        hits: [
          {
            _source: {
              caseId: {
                S: '1',
              },
              docketNumber: {
                S: '103-19',
              },
              documentContents: {
                S:
                  'Everyone knows that Reeses Outrageous bars are the best candy',
              },
              documentTitle: {
                S: 'Order for More Candy',
              },
              eventCode: {
                S: 'ODD',
              },
              pk: {
                S: 'case|491b05b4-483f-4b85-8dd7-2dd4c069eb50',
              },
              signedJudgeName: {
                S: 'Guy Fieri',
              },
              sk: {
                S: 'document|8da3946f-f0e0-426e-a5bb-cb4c482fb737',
              },
            },
          },
          {
            _source: {
              caseId: {
                S: '2',
              },
              docketNumber: {
                S: '103-19',
              },
              documentContents: {
                S: 'KitKats are inferior candies',
              },
              documentTitle: {
                S: 'Order for KitKats',
              },
              eventCode: {
                S: 'ODD',
              },
              pk: {
                S: 'case|491b05b4-483f-4b85-8dd7-2dd4c069eb50',
              },
              signedJudgeName: {
                S: 'Guy Fieri',
              },
              sk: {
                S: 'document|8da3946f-f0e0-426e-a5bb-cb4c482fb737',
              },
            },
          },
        ],
      },
    });
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

    expect(applicationContext.getSearchClient().search).toHaveBeenCalled();
    expect(
      applicationContext.getSearchClient().search.mock.calls[0][0].body.query
        .bool.must,
    ).toEqual([
      { match: { 'pk.S': 'case|' } },
      { match: { 'sk.S': 'document|' } },
      {
        bool: {
          should: orderEventCodes.map(eventCode => ({
            match: {
              'eventCode.S': eventCode,
            },
          })),
        },
      },
      {
        exists: {
          field: 'servedAt',
        },
      },
      {
        query_string: {
          default_operator: 'or',
          fields: ['documentContents.S', 'documentTitle.S'],
          query: mockWildcardKeywordForSearch,
        },
      },
    ]);
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
