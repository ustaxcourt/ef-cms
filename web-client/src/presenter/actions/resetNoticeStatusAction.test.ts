import { resetNoticeStatusAction } from './resetNoticeStatusAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('resetNoticeStatusAction', () => {
  it('should reset the state for the current scanning session', async () => {
    const result = await runAction(resetNoticeStatusAction, {
      props: {
        totalCases: 100,
      },
      state: {
        noticeStatusState: {},
      },
    });

    expect(result.state.noticeStatusState.totalCases).toEqual(100);
    expect(result.state.noticeStatusState.casesProcessed).toEqual(0);
  });
});
