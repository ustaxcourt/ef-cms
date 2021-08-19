import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getCaseDeadlinesAction } from './getCaseDeadlinesAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getCaseDeadlinesAction', () => {
  const START_DATE = '2020-01-01T05:00:00.000Z';
  const END_DATE = '2020-02-01T05:00:00.000Z';

  presenter.providers.applicationContext = applicationContext;

  beforeAll(() => {
    applicationContext
      .getUseCases()
      .getCaseDeadlinesInteractor.mockReturnValue({
        deadlines: [{ description: 'hello world' }],
        totalCount: 1,
      });
  });

  it('gets all case deadlines with a default page of 1 if a page is not set', async () => {
    const result = await runAction(getCaseDeadlinesAction, {
      modules: {
        presenter,
      },
      state: {
        caseDeadlineReport: {
          judgeFilter: 'Buch',
        },
        screenMetadata: {
          filterEndDate: END_DATE,
          filterStartDate: START_DATE,
        },
      },
    });

    expect(
      applicationContext.getUseCases().getCaseDeadlinesInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      endDate: END_DATE,
      judge: 'Buch',
      page: 1,
      startDate: START_DATE,
    });
    expect(result.output).toEqual({
      caseDeadlines: [{ description: 'hello world' }],
      totalCount: 1,
    });
  });

  it('gets all case deadlines with a page from state.caseDeadlineReport.page', async () => {
    await runAction(getCaseDeadlinesAction, {
      modules: {
        presenter,
      },
      state: {
        caseDeadlineReport: {
          page: 3,
        },
        screenMetadata: {
          filterEndDate: END_DATE,
          filterStartDate: START_DATE,
        },
      },
    });
    expect(
      applicationContext.getUseCases().getCaseDeadlinesInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      page: 3,
    });
  });
});
