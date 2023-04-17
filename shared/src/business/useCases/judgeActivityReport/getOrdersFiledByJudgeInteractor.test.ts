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

  it('should return the opinions filed by the judge provided in the date range provided, sorted by eventCode (ascending)', async () => {
    applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch.mockResolvedValue({
        results: [
          {
            eventCode: 'O',
          },
          {
            eventCode: 'OAL',
          },
        ],
      });

    const result = await getOrdersFiledByJudgeInteractor(
      applicationContext,
      mockValidRequest,
    );

    expect(result).toEqual([
      { count: 1, documentType: 'Order', eventCode: 'O' },
      {
        count: 1,
        documentType: 'Order that the letter "L" is added to Docket number',
        eventCode: 'OAL',
      },
    ]);
  });
});
