import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getJudgeActivityReportCountsAction } from './getJudgeActivityReportCountsAction';
import { judgeUser } from '../../../../../shared/src/test/mockUsers';
import {
  mockCountOfOpinionsIssuedByJudge,
  mockCountOfOrdersIssuedByJudge,
} from '@shared/test/mockSearchResults';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getJudgeActivityReportCountsAction', () => {
  presenter.providers.applicationContext = applicationContext;

  const mockStartDate = '02/20/2021';
  const mockEndDate = '03/03/2021';
  const mockJudgeName = judgeUser.name;

  beforeAll(() => {
    applicationContext
      .getUseCases()
      .getCountOfCaseDocumentsFiledByJudgesInteractor.mockResolvedValue(
        mockCountOfOrdersIssuedByJudge,
      );
  });

  it('should make a call to retrieve orders signed by the provided judge in the date range provided from persistence and return it to props', async () => {
    const result = await runAction(getJudgeActivityReportCountsAction, {
      modules: {
        presenter,
      },
      state: {
        judgeActivityReport: {
          filters: {
            endDate: mockEndDate,
            judgeName: mockJudgeName,
            startDate: mockStartDate,
          },
        },
        judges: [judgeUser],
      },
    });

    expect(
      applicationContext.getUseCases()
        .getCountOfCaseDocumentsFiledByJudgesInteractor.mock.calls[0][1],
    ).toMatchObject({
      endDate: mockEndDate,
      judges: [judgeUser.userId],
      startDate: mockStartDate,
    });

    expect(result.output.orders).toEqual(mockCountOfOrdersIssuedByJudge);
  });

  it('should make a call to return opinions by the provided judge in the date range provided from persistence', async () => {
    applicationContext
      .getUseCases()
      .getCountOfCaseDocumentsFiledByJudgesInteractor.mockResolvedValue(
        mockCountOfOpinionsIssuedByJudge,
      );
    const result = await runAction(getJudgeActivityReportCountsAction, {
      modules: {
        presenter,
      },
      state: {
        judgeActivityReport: {
          filters: {
            endDate: mockEndDate,
            judgeName: mockJudgeName,
            startDate: mockStartDate,
          },
        },
        judges: [judgeUser],
      },
    });

    expect(
      applicationContext.getUseCases()
        .getCountOfCaseDocumentsFiledByJudgesInteractor.mock.calls[0][1],
    ).toMatchObject({
      endDate: mockEndDate,
      judges: [judgeUser.userId],
      startDate: mockStartDate,
    });

    expect(result.output.opinions).toEqual(mockCountOfOpinionsIssuedByJudge);
  });
});
