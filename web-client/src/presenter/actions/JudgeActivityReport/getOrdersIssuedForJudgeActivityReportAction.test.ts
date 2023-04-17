import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getOrdersIssuedForJudgeActivityReportAction } from './getOrdersIssuedForJudgeActivityReportAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getOrdersIssuedForJudgeActivityReportAction', () => {
  presenter.providers.applicationContext = applicationContext;

  const mockStartDate = '02/20/2021';
  const mockEndDate = '03/03/2021';
  const mockJudgeName = 'Sotomayor';
  const mockOrdersFiledByJudge = [];

  beforeEach(() => {
    applicationContext
      .getUseCases()
      .getOrdersFiledByJudgeInteractor.mockReturnValue(mockOrdersFiledByJudge);
  });

  it('should retrieve orders by the provided judge in the date range provided from persistence and return it to props', async () => {
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
    expect(output.ordersIssued).toBe(mockOrdersFiledByJudge);
  });
});
