import { ORDER_EVENT_CODES } from '@shared/business/entities/EntityConstants';
import { OrdersReturnType } from '@web-client/presenter/judgeActivityReportState';
import { SeachClientResultsType } from '@web-api/persistence/elasticsearch/searchClient';
import { applicationContext } from '../../test/createTestApplicationContext';
import { getOrdersFiledByJudgeInteractor } from './getOrdersFiledByJudgeInteractor';
import { judgeUser, petitionsClerkUser } from '../../../test/mockUsers';

const mockOrdersIssuedByJudge = [
  { count: 2, documentType: 'Order', eventCode: 'O' },
  {
    count: 1,
    documentType: 'Order that the letter "L" is added to Docket number',
    eventCode: 'OAL',
  },
  {
    count: 1,
    documentType: 'Order that the letter "X" is deleted from the Docket number',
    eventCode: 'ODX',
  },
  {
    count: 5,
    documentType: 'T.C. Opinion',
    eventCode: 'TCOP',
  },
];

const mockOrdersFiledTotal = 9;

export const mockOrdersAggregated: OrdersReturnType = {
  ordersFiledTotal: mockOrdersFiledTotal,
  results: mockOrdersIssuedByJudge,
};

describe('getOrdersFiledByJudgeInteractor', () => {
  const mockValidRequest = {
    endDate: '03/21/2020',
    judges: [judgeUser.name],
    startDate: '02/12/2020',
  };

  const excludedOrderEventCodes = ['OAJ', 'SPOS', 'SPTO', 'OST'];
  const orderEventCodesToSearch = ORDER_EVENT_CODES.filter(
    eventCode => !excludedOrderEventCodes.includes(eventCode),
  );

  const mockOrdersResults: SeachClientResultsType = {
    aggregations: {
      search_field_count: {
        buckets: [
          { doc_count: 2, key: 'O' },
          { doc_count: 1, key: 'OAL' },
          { doc_count: 1, key: 'ODX' },
          { doc_count: 5, key: 'TCOP' },
        ],
      },
    },
    total: mockOrdersFiledTotal,
  };
  const mockJudges = [judgeUser.name];

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(judgeUser);
    applicationContext
      .getPersistenceGateway()
      .fetchEventCodesCountForJudges.mockResolvedValue(mockOrdersResults);
  });

  it('should return an error when the user is not authorized to generate the report', async () => {
    applicationContext.getCurrentUser.mockReturnValue(petitionsClerkUser);

    await expect(
      getOrdersFiledByJudgeInteractor(applicationContext, mockValidRequest),
    ).rejects.toThrow('Unauthorized');
  });

  it('should return an error when the search parameters are not valid', async () => {
    await expect(
      getOrdersFiledByJudgeInteractor(applicationContext, {
        endDate: 'baddabingbaddaboom',
        judges: [judgeUser.name],
        startDate: 'yabbadabbadoo',
      }),
    ).rejects.toThrow();
  });

  it('should return the orders filed by the judge provided in the date range provided, sorted by eventCode (ascending)', async () => {
    const orders = await getOrdersFiledByJudgeInteractor(
      applicationContext,
      mockValidRequest,
    );

    expect(
      applicationContext.getPersistenceGateway().fetchEventCodesCountForJudges
        .mock.calls[0][0],
    ).toMatchObject({
      params: {
        documentEventCodes: orderEventCodesToSearch,
        endDate: '2020-03-22T03:59:59.999Z',
        judges: mockJudges,
        searchType: 'order',
        startDate: '2020-02-12T05:00:00.000Z',
      },
    });

    expect(orders).toEqual(mockOrdersAggregated);
  });

  it('should exclude certain order event codes when calling fetchEventCodesCountForJudges', async () => {
    await getOrdersFiledByJudgeInteractor(applicationContext, mockValidRequest);

    expect(
      applicationContext.getPersistenceGateway().fetchEventCodesCountForJudges
        .mock.calls[0][0].params.documentEventCodes,
    ).not.toContain('OAJ');
    expect(
      applicationContext.getPersistenceGateway().fetchEventCodesCountForJudges
        .mock.calls[0][0].params.documentEventCodes,
    ).not.toContain('SPOS');
    expect(
      applicationContext.getPersistenceGateway().fetchEventCodesCountForJudges
        .mock.calls[0][0].params.documentEventCodes,
    ).not.toContain('SPTO');
    expect(
      applicationContext.getPersistenceGateway().fetchEventCodesCountForJudges
        .mock.calls[0][0].params.documentEventCodes,
    ).not.toContain('OST');
  });
});
