import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getCaseDeadlinesAction } from './getCaseDeadlinesAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getCaseDeadlinesAction', () => {
  const START_DATE = '2020-01-01T05:00:00.000Z';
  const END_DATE = '2020-02-01T05:00:00.000Z';

  presenter.providers.applicationContext = applicationContext;

  beforeAll(() => {
    applicationContext
      .getUseCases()
      .getCaseDeadlinesInteractor.mockReturnValue({
        deadlines: [{ description: 'hello world' }],
      });
  });

  it('gets all case deadlines', async () => {
    const judgeId = '123456';
    const result = await runAction(getCaseDeadlinesAction, {
      modules: {
        presenter,
      },
      state: {
        caseDeadlineReport: {
          judgeIdFilter: judgeId,
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
      judgeId,
      startDate: START_DATE,
    });
    expect(result.output).toEqual({
      caseDeadlines: [{ description: 'hello world' }],
    });
  });
});
