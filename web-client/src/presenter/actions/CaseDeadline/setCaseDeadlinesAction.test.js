import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { setCaseDeadlinesAction } from './setCaseDeadlinesAction';

describe('setCaseDeadlinesAction', () => {
  it('sets state.allCaseDeadlines to the props.caseDeadlines passed in', async () => {
    const caseDeadlines = [
      { caseDeadlineId: '123', deadlineDate: '2018-03-01T00:00:00.000Z' },
    ];

    const result = await runAction(setCaseDeadlinesAction, {
      modules: { presenter },
      props: {
        caseDeadlines,
      },
      state: {},
    });

    expect(result.state.allCaseDeadlines).toEqual(caseDeadlines);
  });
});
