const {
  orderAdvancedSearchInteractor,
} = require('./orderAdvancedSearchInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { map } = require('lodash');
const { Order } = require('../entities/orders/Order');

describe('orderAdvancedSearchInteractor', () => {
  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: 'petitionsclerk',
    });
  });

  it('returns an unauthorized error on petitioner user role', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});
    await expect(
      orderAdvancedSearchInteractor({
        applicationContext,
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('returns empty array if no it search params are passed in', async () => {
    const results = await orderAdvancedSearchInteractor({
      applicationContext,
    });

    expect(results).toEqual([]);
  });

  it('calls search function with correct params and returns records for an exact match result', async () => {
    const mockKeywordForSearch = 'outrageous';
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
              sk: {
                S: 'document|8da3946f-f0e0-426e-a5bb-cb4c482fb737',
              },
            },
          },
        ],
      },
    });
    applicationContext.getUseCases().getCaseInteractor.mockResolvedValue({
      caseTitle:
        'Samson Workman, Petitioner v. Commissioner of Internal Revenue',
      docketNumberSuffix: 'AAA',
    });

    const results = await orderAdvancedSearchInteractor({
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
        simple_query_string: {
          default_operator: 'or',
          fields: ['documentContents.S', 'documentTitle.S'],
          query: mockKeywordForSearch,
        },
      },
    ]);
    expect(results).toEqual([
      {
        caseId: '1',
        caseTitle:
          'Samson Workman, Petitioner v. Commissioner of Internal Revenue',
        docketNumber: '103-19',
        docketNumberSuffix: 'AAA',
        documentContents:
          'Everyone knows that Reeses Outrageous bars are the best candy',
        documentTitle: 'Order for More Candy',
        eventCode: 'ODD',
        pk: 'case|491b05b4-483f-4b85-8dd7-2dd4c069eb50',
        sk: 'document|8da3946f-f0e0-426e-a5bb-cb4c482fb737',
      },
      {
        caseId: '2',
        caseTitle:
          'Samson Workman, Petitioner v. Commissioner of Internal Revenue',
        docketNumber: '103-19',
        docketNumberSuffix: 'AAA',
        documentContents: 'KitKats are inferior candies',
        documentTitle: 'Order for KitKats',
        eventCode: 'ODD',
        pk: 'case|491b05b4-483f-4b85-8dd7-2dd4c069eb50',
        sk: 'document|8da3946f-f0e0-426e-a5bb-cb4c482fb737',
      },
    ]);
  });

  xit('populates each found order with docketNumberSuffix and caseTitle', async () => {
    const mockKeywordForSearch = 'outrageous';
    const orderEventCodes = map(Order.ORDER_TYPES, 'eventCode');

    applicationContext.getSearchClient().search.mockResolvedValue({
      hits: {
        hits: [
          {
            _source: {
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
              sk: {
                S: 'document|8da3946f-f0e0-426e-a5bb-cb4c482fb737',
              },
            },
          },
          {
            _source: {
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
              sk: {
                S: 'document|8da3946f-f0e0-426e-a5bb-cb4c482fb737',
              },
            },
          },
        ],
      },
    });

    const results = await orderAdvancedSearchInteractor({
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
        simple_query_string: {
          default_operator: 'or',
          fields: ['documentContents.S', 'documentTitle.S'],
          query: mockKeywordForSearch,
        },
      },
    ]);
    expect(results).toEqual([
      {
        docketNumber: '103-19',
        documentContents:
          'Everyone knows that Reeses Outrageous bars are the best candy',
        documentTitle: 'Order for More Candy',
        eventCode: 'ODD',
        pk: 'case|491b05b4-483f-4b85-8dd7-2dd4c069eb50',
        sk: 'document|8da3946f-f0e0-426e-a5bb-cb4c482fb737',
      },
      {
        docketNumber: '103-19',
        documentContents: 'KitKats are inferior candies',
        documentTitle: 'Order for KitKats',
        eventCode: 'ODD',
        pk: 'case|491b05b4-483f-4b85-8dd7-2dd4c069eb50',
        sk: 'document|8da3946f-f0e0-426e-a5bb-cb4c482fb737',
      },
    ]);
  });
});
