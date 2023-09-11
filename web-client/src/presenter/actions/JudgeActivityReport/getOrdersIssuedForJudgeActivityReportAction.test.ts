import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getOrdersIssuedForJudgeActivityReportAction } from './getOrdersIssuedForJudgeActivityReportAction';
import { judgeUser } from '../../../../../shared/src/test/mockUsers';
import { mockCountOfOrdersIssuedByJudge } from '../../../../../shared/src/business/useCases/judgeActivityReport/getCountOfOrdersFiledByJudgesInteractor.test';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getOrdersIssuedForJudgeActivityReportAction', () => {
  presenter.providers.applicationContext = applicationContext;

  const mockStartDate = '02/20/2021';
  const mockEndDate = '03/03/2021';
  const mockJudgeName = judgeUser.name;

  beforeEach(() => {
    applicationContext
      .getUseCases()
      .getCountOfOrdersFiledByJudgesInteractor.mockReturnValue(
        mockCountOfOrdersIssuedByJudge,
      );
  });

  it('should make a call to retrieve orders signed by the provided judge in the date range provided from persistence and return it to props', async () => {
    const result = await runAction(
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
      applicationContext.getUseCases().getCountOfOrdersFiledByJudgesInteractor
        .mock.calls[0][1],
    ).toMatchObject({
      endDate: mockEndDate,
      judges: [mockJudgeName],
      startDate: mockStartDate,
    });

    expect(result.output.orders).toEqual(mockCountOfOrdersIssuedByJudge);
  });
});
