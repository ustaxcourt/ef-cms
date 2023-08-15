import { ORDER_EVENT_CODES } from '@shared/business/entities/EntityConstants';
import {
  OrdersReturnType,
  getCountOfOrdersFiledByJudgesInteractor,
} from './getCountOfOrdersFiledByJudgesInteractor';
import { applicationContext } from '../../test/createTestApplicationContext';
import { judgeUser, petitionsClerkUser } from '../../../test/mockUsers';

export const mockCountOfFormattedOrdersIssuedByJudge = [
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
    documentType: 'Order to Show Cause',
    eventCode: 'OSC',
  },
];

export const mockCountOfOrdersIssuedByJudge: OrdersReturnType = {
  aggregations: mockCountOfFormattedOrdersIssuedByJudge,
  total: 9,
};

describe('getCountOfOrdersFiledByJudgesInteractor', () => {
  const mockValidRequest = {
    endDate: '03/21/2020',
    judges: [judgeUser.name],
    startDate: '02/12/2020',
  };

  const excludedOrderEventCodes = ['OAJ', 'SPOS', 'SPTO', 'OST'];
  const orderEventCodesToSearch = ORDER_EVENT_CODES.filter(
    eventCode => !excludedOrderEventCodes.includes(eventCode),
  );

  const mockJudges = [judgeUser.name];

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(judgeUser);
    applicationContext
      .getPersistenceGateway()
      .fetchEventCodesCountForJudges.mockResolvedValue(
        mockCountOfOrdersIssuedByJudge,
      );
  });

  it('should return an error when the user is not authorized to generate the report', async () => {
    applicationContext.getCurrentUser.mockReturnValue(petitionsClerkUser);

    await expect(
      getCountOfOrdersFiledByJudgesInteractor(
        applicationContext,
        mockValidRequest,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should return an error when the search parameters are not valid', async () => {
    await expect(
      getCountOfOrdersFiledByJudgesInteractor(applicationContext, {
        endDate: 'baddabingbaddaboom',
        judges: [judgeUser.name],
        startDate: 'yabbadabbadoo',
      }),
    ).rejects.toThrow();
  });

  it('should return the orders filed by the judge provided in the date range provided, sorted by eventCode (ascending)', async () => {
    const orders = await getCountOfOrdersFiledByJudgesInteractor(
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

    expect(orders).toEqual(mockCountOfOrdersIssuedByJudge);
  });

  it('should exclude certain order event codes when calling fetchEventCodesCountForJudges', async () => {
    await getCountOfOrdersFiledByJudgesInteractor(
      applicationContext,
      mockValidRequest,
    );

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
