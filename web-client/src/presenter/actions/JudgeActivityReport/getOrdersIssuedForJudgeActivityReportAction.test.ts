import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getOrdersIssuedForJudgeActivityReportAction } from './getOrdersIssuedForJudgeActivityReportAction';
import { judgeUser } from '../../../../../shared/src/test/mockUsers';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getOrdersIssuedForJudgeActivityReportAction', () => {
  presenter.providers.applicationContext = applicationContext;

  const mockStartDate = '02/20/2021';
  const mockEndDate = '03/03/2021';
  const mockJudgeName = judgeUser.name;
  const mockOrdersIssuedByJudge = [
    {
      count: 1,
      documentType: 'Order',
      eventCode: 'O',
    },
    {
      count: 5,
      documentType: 'Order for Dismissal',
      eventCode: 'ODS',
    },
  ];

  beforeEach(() => {
    applicationContext
      .getUseCases()
      .getOrdersFiledByJudgeInteractor.mockReturnValue(mockOrdersIssuedByJudge);
  });

  it('should retrieve orders signed by the provided judge in the date range provided from persistence and return it to props', async () => {
    const { output } = await runAction(
      getOrdersIssuedForJudgeActivityReportAction,
      {
        modules: {
          presenter,
        },
        state: {
          judgeActivityReport: {
            filters: {
              endDate: mockEndDate,
              judges: [mockJudgeName],
              startDate: mockStartDate,
            },
          },
        },
      },
    );

    expect(
      applicationContext.getUseCases().getOrdersFiledByJudgeInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      endDate: mockEndDate,
      judges: [mockJudgeName],
      startDate: mockStartDate,
    });
    expect(output.orders).toBe(mockOrdersIssuedByJudge);
  });
});
