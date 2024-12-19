import { runAction } from '@web-client/presenter/test.cerebral';
import { setPendingReportSelectedJudgeAction } from './setPendingReportSelectedJudgeAction';

describe('setPendingReportSelectedJudgeAction', () => {
  it('defaults state.pendingReports', async () => {
    const { state } = await runAction(setPendingReportSelectedJudgeAction, {
      props: {
        judge: 'Buch',
      },
    });
    expect(state.pendingReports).toEqual({
      hasPendingItemsResults: false,
      pendingItems: [],
      selectedJudge: 'Buch',
    });
  });
});
