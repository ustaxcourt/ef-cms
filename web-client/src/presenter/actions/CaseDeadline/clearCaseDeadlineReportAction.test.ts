import { clearCaseDeadlineReportAction } from './clearCaseDeadlineReportAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearCaseDeadlineReportAction', () => {
  it('sets state.caseDeadlineReport to an empty object', async () => {
    const result = await runAction(clearCaseDeadlineReportAction, {
      state: {
        caseDeadlineReport: {
          caseDeadlines: [
            { caseDeadlineId: '06829d43-dec6-46f4-b850-592d31923665' },
          ],
          totalCount: 1,
        },
      },
    });
    expect(result.state.caseDeadlineReport).toEqual({});
  });
});
