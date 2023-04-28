import { MAX_ELASTICSEARCH_PAGINATION } from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { getOrdersFiledByJudgeInteractor } from './getOrdersFiledByJudgeInteractor';
import { judgeUser, petitionsClerkUser } from '../../../test/mockUsers';

describe('getOrdersFiledByJudgeInteractor', () => {
  const mockValidRequest = {
    endDate: '03/21/2020',
    judgeName: judgeUser.name,
    startDate: '02/12/2020',
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
        judgeName: judgeUser.name,
        startDate: 'yabbadabbadoo',
      }),
    ).rejects.toThrow();
  });

  it('should return the orders filed by the judge provided in the date range provided, sorted by eventCode (ascending)', async () => {
    applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch.mockResolvedValue({
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
      });

    const result = await getOrdersFiledByJudgeInteractor(
      applicationContext,
      mockValidRequest,
    );

    expect(
      applicationContext.getPersistenceGateway().advancedDocumentSearch.mock
        .calls[0][0],
    ).toMatchObject({
      endDate: '2020-03-22T03:59:59.999Z',
      judge: mockValidRequest.judgeName,
      overrideResultSize: MAX_ELASTICSEARCH_PAGINATION,
      startDate: '2020-02-12T05:00:00.000Z',
    });
    expect(result).toEqual([
      { count: 2, documentType: 'Order', eventCode: 'O' },
      {
        count: 1,
        documentType: 'Order that the letter "L" is added to Docket number',
        eventCode: 'OAL',
      },
      {
        count: 1,
        documentType:
          'Order that the letter "X" is deleted from the Docket number',
        eventCode: 'ODX',
      },
    ]);
  });

  it('should return an empty list when no matching orders for the judge in the date range provided are found', async () => {
    applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch.mockResolvedValue({
        results: [],
      });

    const result = await getOrdersFiledByJudgeInteractor(
      applicationContext,
      mockValidRequest,
    );

    expect(result).toEqual([]);
  });

  it('should exclude certain order event codes when calling advancedDocumentSearch', async () => {
    applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch.mockResolvedValue([]);

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
