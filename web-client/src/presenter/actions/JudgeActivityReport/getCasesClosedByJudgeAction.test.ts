import { CASE_STATUS_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { CasesClosedType } from '../../judgeActivityReportState';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getCasesClosedByJudgeAction } from './getCasesClosedByJudgeAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getCasesClosedByJudgeAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should make a call to retrieve the aggregate of cases closed by selected judges using the date range provided', async () => {
    const mockStartDate = '02/20/2021';
    const mockEndDate = '03/03/2021';
    const mockJudgeName = 'Sotomayor';
    const mockCasesClosedByJudge: CasesClosedType = {
      [CASE_STATUS_TYPES.closed]: 4,
      [CASE_STATUS_TYPES.closedDismissed]: 8,
    };
    applicationContext
      .getUseCases()
      .getCasesClosedByJudgeInteractor.mockReturnValue(mockCasesClosedByJudge);

    const { output } = await runAction(getCasesClosedByJudgeAction as any, {
      modules: {
        presenter,
      },
      state: {
        judgeActivityReport: {
          filters: {
            endDate: mockEndDate,
            judgesSelection: [mockJudgeName],
            startDate: mockStartDate,
          },
        },
      },
    });

    expect(
      applicationContext.getUseCases().getCasesClosedByJudgeInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      endDate: mockEndDate,
      judgesSelection: [mockJudgeName],
      startDate: mockStartDate,
    });
    expect(output.casesClosedByJudge).toBe(mockCasesClosedByJudge);
  });
});
