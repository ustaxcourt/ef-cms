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
      },
      state: {
        caseDeadlineReport: {},
      },
    });

    expect(result.state.caseDeadlineReport).toEqual({ caseDeadlines });
  });

  it('appends props.caseDeadlines onto state.caseDeadlineReport.caseDeadlines if state.caseDeadlineReport.caseDeadlines is already set', async () => {
    const caseDeadlines = [
      { caseDeadlineId: '123', deadlineDate: '2018-03-01T00:00:00.000Z' },
    ];

    const result = await runAction(setCaseDeadlinesAction, {
      modules: { presenter },
      props: {
        caseDeadlines,
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
});
