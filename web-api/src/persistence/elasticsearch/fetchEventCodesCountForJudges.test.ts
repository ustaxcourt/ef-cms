import {
  OPINION_EVENT_CODES_WITH_BENCH_OPINION,
  ORDER_EVENT_CODES,
} from '@shared/business/entities/EntityConstants';
import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { fetchEventCodesCountForJudges } from './fetchEventCodesCountForJudges';
import { judgeUser } from '@shared/test/mockUsers';
import { search } from './searchClient';
jest.mock('./searchClient');

describe('fetchEventCodesCountForJudges', () => {
  const orderAggsBucket = [
    { doc_count: 2, key: 'O' },
    { doc_count: 1, key: 'ODX' },
    { doc_count: 5, key: 'OSC' },
  ];

  const opinionAggsBucket = [
    { doc_count: 2, key: 'SOP' },
    { doc_count: 1, key: 'TCOP' },
    { doc_count: 5, key: 'MOP' },
  ];

  const mockOrdersResults = {
    aggregations: {
      search_field_count: {
        buckets: orderAggsBucket,
      },
    },
    total: 8,
  };

  const mockOpinionsResults = {
    aggregations: {
      search_field_count: {
        buckets: opinionAggsBucket,
      },
    },
    total: 8,
  };

  const documentQueryBody = {
    aggs: {
      search_field_count: {
        terms: {
          field: 'eventCode.S',
          size: 10,
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
    startDate: '2020-02-12T05:00:00.000Z',
  };

  it("returns the counts of each orders' event codes within a time range using selected judges", async () => {
    const expectedCount = {
      O: 2,
      ODX: 1,
      OSC: 5,
    };

    (search as jest.Mock).mockReturnValue(mockOrdersResults);

    params.documentEventCodes = orderEventCodesToSearch;
    const { aggregations, total } = await fetchEventCodesCountForJudges({
      applicationContext,
      params,
    });

    documentQueryBody.aggs.search_field_count.terms.size =
      params.documentEventCodes.length;

    expect(
      (search as jest.Mock).mock.calls[0][0].searchParameters.body,
    ).toMatchObject({
      ...documentQueryBody,
      query: {
        bool: {
          filter: [
            { term: { 'entityName.S': 'DocketEntry' } },
            {
              exists: {
                field: 'servedAt',
              },
            },
            {
              term: {
                'isStricken.BOOL': false,
              },
            },
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

    orderEventCodesToSearch.forEach(evCode => {
      expect(aggregations).toContainEqual({
        count: expectedCount[evCode] || 0,
        eventCode: evCode,
      });
    });
    expect(total).toEqual(8);
  });

  it("returns the count of opinion's event codes within a time range using selected judges", async () => {
    (search as jest.Mock).mockReturnValue(mockOpinionsResults);

    const expectedCount = {
      MOP: 5,
      SOP: 2,
      TCOP: 1,
    };

    params.documentEventCodes = OPINION_EVENT_CODES_WITH_BENCH_OPINION;

    const { aggregations, total } = await fetchEventCodesCountForJudges({
      applicationContext,
      params,
    });

    documentQueryBody.aggs.search_field_count.terms.size =
      params.documentEventCodes.length;

    expect(
      (search as jest.Mock).mock.calls[0][0].searchParameters.body,
    ).toMatchObject({
      ...documentQueryBody,
      query: {
        bool: {
          filter: [
            { term: { 'entityName.S': 'DocketEntry' } },
            {
              exists: {
                field: 'servedAt',
              },
            },
            {
              term: {
                'isStricken.BOOL': false,
              },
            },
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

    OPINION_EVENT_CODES_WITH_BENCH_OPINION.forEach(evCode => {
      expect(aggregations).toContainEqual({
        count: expectedCount[evCode] || 0,
        eventCode: evCode,
      });
    });
    expect(total).toEqual(8);
  });
});
