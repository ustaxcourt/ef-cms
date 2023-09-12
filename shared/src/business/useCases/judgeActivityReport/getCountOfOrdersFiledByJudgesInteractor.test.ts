import { COURT_ISSUED_EVENT_CODES } from '../../entities/EntityConstants';
import { ORDER_EVENT_CODES } from '@shared/business/entities/EntityConstants';
import {
  OrdersReturnType,
  getCountOfOrdersFiledByJudgesInteractor,
} from './getCountOfOrdersFiledByJudgesInteractor';
import { applicationContext } from '../../test/createTestApplicationContext';
import { judgeUser, petitionsClerkUser } from '../../../test/mockUsers';

export const mockCountOfFormattedOrdersIssuedByJudge = [
  { count: 2, eventCode: 'O' },
  { count: 0, eventCode: 'OAL' },
  { count: 0, eventCode: 'OAP' },
  { count: 0, eventCode: 'OAPF' },
  { count: 0, eventCode: 'OAR' },
  { count: 0, eventCode: 'OAS' },
  { count: 0, eventCode: 'OASL' },
  { count: 0, eventCode: 'OAW' },
  { count: 0, eventCode: 'OAX' },
  { count: 0, eventCode: 'OCA' },
  { count: 0, eventCode: 'OD' },
  { count: 0, eventCode: 'ODD' },
  { count: 0, eventCode: 'ODP' },
  { count: 0, eventCode: 'ODR' },
  { count: 0, eventCode: 'ODS' },
  { count: 0, eventCode: 'ODSL' },
  { count: 0, eventCode: 'ODW' },
  { count: 1, eventCode: 'ODX' },
  { count: 0, eventCode: 'OF' },
  { count: 0, eventCode: 'OFAB' },
  { count: 0, eventCode: 'OFFX' },
  { count: 0, eventCode: 'OFWD' },
  { count: 0, eventCode: 'OFX' },
  { count: 0, eventCode: 'OIP' },
  { count: 0, eventCode: 'OJR' },
  { count: 0, eventCode: 'OODS' },
  { count: 0, eventCode: 'OPFX' },
  { count: 0, eventCode: 'OPX' },
  { count: 0, eventCode: 'ORAP' },
  { count: 0, eventCode: 'OROP' },
  { count: 5, eventCode: 'OSC' },
  { count: 0, eventCode: 'OSCP' },
  { count: 0, eventCode: 'OSUB' },
  { count: 0, eventCode: 'OAD' },
  { count: 0, eventCode: 'ODJ' },
];

const expectedResults = mockCountOfFormattedOrdersIssuedByJudge.map(item => ({
  ...item,
  documentType: COURT_ISSUED_EVENT_CODES.find(
    event => event.eventCode === item.eventCode,
  ).documentType,
}));

export const mockCountOfOrdersIssuedByJudge = {
  aggregations: mockCountOfFormattedOrdersIssuedByJudge,
  total: 7,
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
      .fetchEventCodesCountForJudges.mockResolvedValue({
        aggregations: mockCountOfFormattedOrdersIssuedByJudge,
        total: 7,
      });
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
    const orders: OrdersReturnType =
      await getCountOfOrdersFiledByJudgesInteractor(
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
        startDate: '2020-02-12T05:00:00.000Z',
      },
    });

    expect(orders).toEqual({ aggregations: expectedResults, total: 7 });
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
