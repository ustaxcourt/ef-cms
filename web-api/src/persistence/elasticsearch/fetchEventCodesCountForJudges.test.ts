import { ORDER_EVENT_CODES } from '@shared/business/entities/EntityConstants';
import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { fetchEventCodesCountForJudges } from './fetchEventCodesCountForJudges';
import { judgeUser } from '@shared/test/mockUsers';
import { mockCountOfFormattedOrdersIssuedByJudge } from '@shared/business/useCases/judgeActivityReport/getCountOfOrdersFiledByJudgesInteractor.test';
import { search } from './searchClient';
jest.mock('./searchClient');

describe('fetchEventCodesCountForJudges', () => {
  const aggsBucket = [
    { doc_count: 2, key: 'O' },
    { doc_count: 1, key: 'OAL' },
    { doc_count: 1, key: 'ODX' },
    { doc_count: 5, key: 'OSC' },
  ];

  const mockOrdersResults = {
    aggregations: {
      search_field_count: {
        buckets: aggsBucket,
      },
    },
    total: 9,
  };

  const documentQueryBody = {
    aggs: {
      search_field_count: {
        terms: {
          field: 'eventCode.S',
        },
      },
    },
    query: {
      bool: {
        filter: [{ term: { 'entityName.S': 'DocketEntry' } }],
        minimum_should_match: 1,
        should: [],
      },
    },
    size: 0,
    track_total_hits: true,
  };

  const excludedOrderEventCodes = ['OAJ', 'SPOS', 'SPTO', 'OST'];
  const orderEventCodesToSearch = ORDER_EVENT_CODES.filter(
    eventCode => !excludedOrderEventCodes.includes(eventCode),
  );

  const params = {
    documentEventCodes: orderEventCodesToSearch,
    endDate: '2020-03-22T03:59:59.999Z',
    judges: [judgeUser.name],
    searchType: 'order',
    startDate: '2020-02-12T05:00:00.000Z',
  };

  it('returns searches for event codes within a time range using selected judges', async () => {
    search.mockReturnValue(mockOrdersResults);

    const { aggregations, total } = await fetchEventCodesCountForJudges({
      applicationContext,
      params,
    });

    expect(search.mock.calls[0][0].searchParameters.body).toMatchObject({
      ...documentQueryBody,
      query: {
        bool: {
          filter: [
            { term: { 'entityName.S': 'DocketEntry' } },
            {
              range: {
                'filingDate.S': {
                  gte: `${params.startDate}||/h`,
                  lte: `${params.endDate}||/h`,
                },
              },
            },
            {
              terms: { 'eventCode.S': params.documentEventCodes },
            },
          ],
          minimum_should_match: 1,
          should: [
            {
              match: {
                ['signedJudgeName.S']: {
                  operator: 'and',
                  query: judgeUser.name,
                },
              },
            },
            {
              match: {
                ['judge.S']: judgeUser.name,
              },
            },
          ],
        },
      },
    });

    expect(aggregations).toMatchObject(mockCountOfFormattedOrdersIssuedByJudge);
    expect(total).toEqual(9);
  });
});
