import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getOpinionsForJudgeActivityReportAction } from './getOpinionsForJudgeActivityReportAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getOpinionsForJudgeActivityReportAction', () => {
  presenter.providers.applicationContext = applicationContext;

  const mockStartDate = '02/20/2021';
  const mockEndDate = '03/03/2021';
  const mockJudgeName = 'Sotomayor';
  const mockOpinionsFiledByJudge = [
    {
      count: 1,
      documentType: 'Memorandum Opinion',
      eventCode: 'MOP',
    },
    {
      count: 0,
      documentType: 'S Opinion',
      eventCode: 'SOP',
    },
    {
      count: 0,
      documentType: 'TC Opinion',
      eventCode: 'TCOP',
    },
    {
      count: 4,
      documentType: 'Bench Opinion',
      eventCode: 'OST',
    },
  ];

  beforeEach(() => {
    applicationContext
      .getUseCases()
      .getOpinionsFiledByJudgeInteractor.mockReturnValue(
        mockOpinionsFiledByJudge,
      );
  });

  it('should retrieve opinions by the provided judge in the date range provided from persistence and return it to props', async () => {
    const { output } = await runAction(
      getOpinionsForJudgeActivityReportAction,
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
      applicationContext.getUseCases().getOpinionsFiledByJudgeInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      endDate: mockEndDate,
      judgeName: mockJudgeName,
      startDate: mockStartDate,
    });
    expect(output.opinions).toBe(mockOpinionsFiledByJudge);
  });
});
