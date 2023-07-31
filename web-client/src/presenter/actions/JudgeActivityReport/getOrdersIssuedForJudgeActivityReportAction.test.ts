import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getOrdersIssuedForJudgeActivityReportAction } from './getOrdersIssuedForJudgeActivityReportAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getOrdersIssuedForJudgeActivityReportAction', () => {
  presenter.providers.applicationContext = applicationContext;

  const mockStartDate = '02/20/2021';
  const mockEndDate = '03/03/2021';
  const mockJudgeName = 'Sotomayor';
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
          form: {
            endDate: mockEndDate,
            judgeName: mockJudgeName,
            startDate: mockStartDate,
          },
        },
      },
    );

    expect(
      applicationContext.getUseCases().getOrdersFiledByJudgeInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      endDate: mockEndDate,
      judgeName: mockJudgeName,
      startDate: mockStartDate,
    });
    expect(output.orders).toBe(mockOrdersIssuedByJudge);
  });
});
