import { MAX_ELASTICSEARCH_PAGINATION } from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { getOrdersFiledByJudgeInteractor } from './getOrdersFiledByJudgeInteractor';
import { judgeUser, petitionsClerkUser } from '../../../test/mockUsers';

export const mockOrdersIssuedByJudge = [
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
];

describe('getOrdersFiledByJudgeInteractor', () => {
  const mockClientConnectionID = 'clientConnnectionID';
  const mockValidRequest = {
    clientConnectionId: mockClientConnectionID,
    endDate: '03/21/2020',
    judges: [judgeUser.name],
    startDate: '02/12/2020',
  };

  const mockResults = {
    results: [
      {
        documentType:
          'Order that the letter "X" is deleted from the Docket number',
        eventCode: 'ODX',
      },
      {
        documentType: 'Order',
        eventCode: 'O',
      },
      {
        documentType: 'Order that the letter "L" is added to Docket number',
        eventCode: 'OAL',
      },
      {
        documentType: 'Order',
        eventCode: 'O',
      },
    ],
  };

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(judgeUser);
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
    applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch.mockResolvedValue(mockResults);

    await getOrdersFiledByJudgeInteractor(applicationContext, mockValidRequest);

    expect(
      applicationContext.getPersistenceGateway().advancedDocumentSearch.mock
        .calls[0][0],
    ).toMatchObject({
      endDate: '2020-03-22T03:59:59.999Z',
      judge: judgeUser.name,
      overrideResultSize: MAX_ELASTICSEARCH_PAGINATION,
      startDate: '2020-02-12T05:00:00.000Z',
    });

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser,
    ).toHaveBeenCalledWith({
      applicationContext: expect.anything(),
      clientConnectionId: mockValidRequest.clientConnectionId,
      message: {
        action: 'fetch_orders_complete',
        orders: mockOrdersIssuedByJudge,
      },
      userId: judgeUser.userId,
    });
  });

  it('should return an empty list of orders when there are no matching orders for the selected judge in the date range provided', async () => {
    applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch.mockResolvedValue({
        results: [],
      });

    await getOrdersFiledByJudgeInteractor(applicationContext, mockValidRequest);

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser,
    ).toHaveBeenCalledWith({
      applicationContext: expect.anything(),
      clientConnectionId: mockValidRequest.clientConnectionId,
      message: {
        action: 'fetch_orders_complete',
        orders: [],
      },
      userId: judgeUser.userId,
    });
  });

  it('should exclude certain order event codes when calling advancedDocumentSearch', async () => {
    applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch.mockResolvedValue({
        results: mockResults,
      });

    await getOrdersFiledByJudgeInteractor(applicationContext, mockValidRequest);

    expect(
      applicationContext.getPersistenceGateway().advancedDocumentSearch.mock
        .calls[0][0].documentEventCodes,
    ).not.toContain('OAJ');
    expect(
      applicationContext.getPersistenceGateway().advancedDocumentSearch.mock
        .calls[0][0].documentEventCodes,
    ).not.toContain('SPOS');
    expect(
      applicationContext.getPersistenceGateway().advancedDocumentSearch.mock
        .calls[0][0].documentEventCodes,
    ).not.toContain('SPTO');
    expect(
      applicationContext.getPersistenceGateway().advancedDocumentSearch.mock
        .calls[0][0].documentEventCodes,
    ).not.toContain('OST');
  });
});
