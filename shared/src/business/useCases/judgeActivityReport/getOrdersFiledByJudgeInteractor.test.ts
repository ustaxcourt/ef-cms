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
            caseCaption: 'Samson Workman, Petitioner',
            docketEntryId: 'c5bee7c0-bd98-4504-890b-b00eb398e547',
            docketNumber: '103-19',
            documentTitle: 'Something Something Cool',
            documentType: 'Order',
            eventCode: 'O',
            signedJudgeName: 'Guy Fieri',
          },
          {
            caseCaption: 'Samson Workman, Petitioner',
            docketEntryId: 'c5bee7c0-bd98-4504-890b-b00eb398e547',
            docketNumber: '103-19',
            documentTitle: 'Order that a letter is added to the Docket number',
            documentType: 'Order that a letter is added to the Docket number',
            eventCode: 'OAL',
            signedJudgeName: 'Guy Fieri',
          },
        ],
      });

    const result = await getOrdersFiledByJudgeInteractor(
      applicationContext,
      mockValidRequest,
    );

    // this is NOT static, so it should only return the orders that have a count
    expect(result).toEqual([
      { count: 1, documentType: 'Order', eventCode: 'O' },
      {
        count: 1,
        documentType: 'Order that a letter is added to the Docket number',
        eventCode: 'OAL',
      },
    ]);
  });
});
