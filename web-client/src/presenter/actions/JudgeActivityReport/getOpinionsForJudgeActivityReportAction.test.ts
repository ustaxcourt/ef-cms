import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getOpinionsForJudgeActivityReportAction } from './getOpinionsForJudgeActivityReportAction';
import { judgeUser } from '@shared/test/mockUsers';
import { mockCountOfOpinionsIssuedByJudge } from '@shared/business/useCases/judgeActivityReport/getCountOfOpinionsFiledByJudgesInteractor.test';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getOpinionsForJudgeActivityReportAction', () => {
  presenter.providers.applicationContext = applicationContext;

  const mockStartDate = '02/20/2021';
  const mockEndDate = '03/03/2021';
  const mockJudgeName = judgeUser.name;

  applicationContext
    .getUseCases()
    .getCountOfOpinionsFiledByJudgesInteractor.mockReturnValue(
      mockCountOfOpinionsIssuedByJudge,
    );

  it('should make a call to return opinions by the provided judge in the date range provided from persistence', async () => {
    const result = await runAction(getOpinionsForJudgeActivityReportAction, {
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
      applicationContext.getUseCases().getCountOfOpinionsFiledByJudgesInteractor
        .mock.calls[0][1],
    ).toMatchObject({
      endDate: mockEndDate,
      judges: [mockJudgeName],
      startDate: mockStartDate,
    });

    expect(result.output.opinions).toEqual(mockCountOfOpinionsIssuedByJudge);
  });
});
