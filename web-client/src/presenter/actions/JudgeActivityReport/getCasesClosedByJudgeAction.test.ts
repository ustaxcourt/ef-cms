import { CASE_STATUS_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getCasesClosedByJudgeAction } from './getCasesClosedByJudgeAction';
import { judgeUser } from '../../../../../shared/src/test/mockUsers';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getCasesClosedByJudgeAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should retrieve cases closed by the provided judge in the date range provided from persistence and return it to props', async () => {
    const mockStartDate = '02/20/2021';
    const mockEndDate = '03/03/2021';
    const mockJudgeName = judgeUser.name;
    const mockCasesClosedByJudge = {
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
            judges: [mockJudgeName],
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
      judges: [mockJudgeName],
      startDate: mockStartDate,
    });
    expect(output.casesClosedByJudge).toBe(mockCasesClosedByJudge);
  });
});
