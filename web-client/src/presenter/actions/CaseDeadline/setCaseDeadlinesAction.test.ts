import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setCaseDeadlinesAction } from './setCaseDeadlinesAction';

describe('setCaseDeadlinesAction', () => {
  it('sets state.caseDeadlineReport.caseDeadlines to the props.caseDeadlines passed in', async () => {
    const caseDeadlines = [
      { caseDeadlineId: '123', deadlineDate: '2018-03-01T00:00:00.000Z' },
    ];

    const result = await runAction(setCaseDeadlinesAction, {
      modules: { presenter },
      props: {
        caseDeadlines,
        totalCount: 3,
      },
      state: {
        caseDeadlineReport: {},
      },
    });

    expect(result.state.caseDeadlineReport).toEqual({
      caseDeadlines,
      page: 2,
      totalCount: 3,
    });
  });

  it('appends props.caseDeadlines onto state.caseDeadlineReport.caseDeadlines if state.caseDeadlineReport.caseDeadlines is already set', async () => {
    const caseDeadlines = [
      { caseDeadlineId: '123', deadlineDate: '2018-03-01T00:00:00.000Z' },
    ];

    const result = await runAction(setCaseDeadlinesAction, {
      modules: { presenter },
      props: {
        caseDeadlines,
        totalCount: 3,
      },
      state: {
        caseDeadlineReport: {
          caseDeadlines: [
            { caseDeadlineId: '234', deadlineDate: '2019-03-01T00:00:00.000Z' },
          ],
        },
      },
    });

    expect(result.state.caseDeadlineReport.caseDeadlines.length).toEqual(2);
  });

  it('increments state.caseDeadlineReport.page by 1', async () => {
    const caseDeadlines = [
      { caseDeadlineId: '123', deadlineDate: '2018-03-01T00:00:00.000Z' },
    ];

    const result = await runAction(setCaseDeadlinesAction, {
      modules: { presenter },
      props: {
        caseDeadlines,
        totalCount: 3,
      },
      state: {
        caseDeadlineReport: {
          page: 3,
        },
      },
    });

    expect(result.state.caseDeadlineReport.page).toEqual(4);
  });
});
