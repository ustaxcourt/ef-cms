import {
  OPINION_JUDGE_FIELD,
  ORDER_EVENT_CODES,
  ORDER_JUDGE_FIELD,
} from '@shared/business/entities/EntityConstants';
import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { fetchEventCodesCountForJudges } from './fetchEventCodesCountForJudges';
jest.mock('./searchClient');
import { SeachClientResultsType, search } from './searchClient';
import { judgeUser } from '@shared/test/mockUsers';
import {
  mockOpinionsFiledByJudge,
  mockOpinionsFiledTotal,
} from '@shared/business/useCases/judgeActivityReport/getOpinionsFiledByJudgeInteractor.test';
import {
  mockOrdersFiledTotal,
  mockOrdersIssuedByJudge,
} from '@shared/business/useCases/judgeActivityReport/getOrdersFiledByJudgeInteractor.test';

describe('fetchEventCodesCountForJudges', () => {
  const ordersAggsBucket = [
    { doc_count: 2, key: 'O' },
    { doc_count: 1, key: 'OAL' },
    { doc_count: 1, key: 'ODX' },
    { doc_count: 5, key: 'OSC' },
  ];

  const opinionsAggsBucket = [
    { doc_count: 177, key: 'MOP' },
    { doc_count: 53, key: 'OST' },
    { doc_count: 34, key: 'SOP' },
    { doc_count: 30, key: 'TCOP' },
  ];

  const mockJudges = [judgeUser.name];

  const mockOrdersResults: SeachClientResultsType = {
    aggregations: {
      search_field_count: {
        buckets: ordersAggsBucket,
      },
    },
    total: mockOrdersFiledTotal,
  };

  const mockOpinionsResults: SeachClientResultsType = {
    aggregations: {
      search_field_count: {
        buckets: opinionsAggsBucket,
      },
    },
    total: mockOpinionsFiledTotal,
  };

  const documentQuery = {
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
    judges: mockJudges,
    searchType: 'order',
    startDate: '2020-02-12T05:00:00.000Z',
  };

  it('returns searches for orders within a time range using selected judges', async () => {
    search.mockReturnValue(mockOrdersResults);

    const { aggregations, total } = await fetchEventCodesCountForJudges({
      applicationContext,
      params,
    });

    expect(search.mock.calls[0][0].searchParameters.body).toMatchObject({
      ...documentQuery,
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
                [`${ORDER_JUDGE_FIELD}.S`]: {
                  operator: 'and',
                  query: judgeUser.name,
                },
              },
            },
          ],
        },
      },
    });

    expect(aggregations).toMatchObject(mockOrdersIssuedByJudge);
    expect(total).toEqual(mockOrdersFiledTotal);
  });

  it('returns searches for opinions within a time range using selected judges', async () => {
    search.mockReturnValue(mockOpinionsResults);

    const { aggregations, total } = await fetchEventCodesCountForJudges({
      applicationContext,
      params: { ...params, searchType: 'opinion' },
    });

    expect(search.mock.calls[0][0].searchParameters.body).toMatchObject({
      ...documentQuery,
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
              match_phrase: {
                [`${OPINION_JUDGE_FIELD}.S`]: judgeUser.name,
              },
            },
          ],
        },
      },
    });

    expect(aggregations).toMatchObject(mockOpinionsFiledByJudge);
    expect(total).toEqual(mockOpinionsFiledTotal);
  });
});
