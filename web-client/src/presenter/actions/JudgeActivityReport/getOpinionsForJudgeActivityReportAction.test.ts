import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getOpinionsForJudgeActivityReportAction } from './getOpinionsForJudgeActivityReportAction';
import { judgeUser } from '../../../../../shared/src/test/mockUsers';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getOpinionsForJudgeActivityReportAction', () => {
  presenter.providers.applicationContext = applicationContext;

  const mockStartDate = '02/20/2021';
  const mockEndDate = '03/03/2021';
  const mockJudgeName = judgeUser.name;
  const mockConnectionID = 'mockConnectionID';

  it('should make a call to retrieve opinions by the provided judge in the date range provided from persistence', async () => {
    await runAction(getOpinionsForJudgeActivityReportAction, {
      modules: {
        presenter,
      },
      state: {
        clientConnectionId: mockConnectionID,
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
      applicationContext.getUseCases().getOpinionsFiledByJudgeInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      clientConnectionId: mockConnectionID,
      endDate: mockEndDate,
      judges: [mockJudgeName],
      startDate: mockStartDate,
    });
  });
});
