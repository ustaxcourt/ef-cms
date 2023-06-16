import { resetPaperServiceStatusAction } from './resetPaperServiceStatusAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('resetPaperServiceStatusAction', () => {
  it('should reset the state for the current scanning session', async () => {
    const result = await runAction(resetPaperServiceStatusAction, {
      props: {
        totalPdfs: 100,
      },
      state: {
        paperServiceStatusState: {},
      },
    });

    expect(result.state.paperServiceStatusState.totalPdfs).toEqual(100);
    expect(result.state.paperServiceStatusState.pdfsAppended).toEqual(0);
  });
});
