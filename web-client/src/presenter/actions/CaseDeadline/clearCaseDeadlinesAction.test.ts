import { clearCaseDeadlinesAction } from './clearCaseDeadlinesAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearCaseDeadlinesAction', () => {
  it('unsets state.caseDeadlineReport.caseDeadlines', async () => {
    const result = await runAction(clearCaseDeadlinesAction, {
      state: {
        caseDeadlineReport: {
          caseDeadlines: [
            { caseDeadlineId: '06829d43-dec6-46f4-b850-592d31923665' },
          ],
        },
      },
    });
    expect(result.state.caseDeadlineReport).toEqual({});
  });
});
