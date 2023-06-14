import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getOpinionsForJudgeActivityReportAction } from './getOpinionsForJudgeActivityReportAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getOpinionsForJudgeActivityReportAction', () => {
  presenter.providers.applicationContext = applicationContext;

  const mockStartDate = '02/20/2021';
  const mockEndDate = '03/03/2021';
  const judgesSelection = ['Sotomayor', 'Colvin'];
  const mockOpinionsFiledByJudges = [
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
        mockOpinionsFiledByJudges,
      );
  });

  it('should retrieve opinions by the provided judges selection and date range provided from persistence and return it to props', async () => {
    const { output } = await runAction(
      getOpinionsForJudgeActivityReportAction,
      {
        modules: {
          presenter,
        },
        state: {
          judgeActivityReport: {
            filters: {
              endDate: mockEndDate,
              judgesSelection,
              startDate: mockStartDate,
            },
          },
        },
      },
    );

    expect(
      applicationContext.getUseCases().getOpinionsFiledByJudgeInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      endDate: mockEndDate,
      judgesSelection,
      startDate: mockStartDate,
    });
    expect(output.opinions).toBe(mockOpinionsFiledByJudges);
  });
});
