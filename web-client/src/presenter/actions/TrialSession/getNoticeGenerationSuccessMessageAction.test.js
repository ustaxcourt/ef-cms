import { getNoticeGenerationSuccessMessageAction } from './getNoticeGenerationSuccessMessageAction';
import { runAction } from 'cerebral/test';

describe('getNoticeGenerationSuccessMessageAction', () => {
  it('gets notice generation success message for paper cases', async () => {
    const result = await runAction(getNoticeGenerationSuccessMessageAction, {
      state: {
        currentPage: 'CaseDetailInternal',
      },
    });

    expect(result.output).toEqual({
      alertSuccess: {
        message: 'Trial details are visible under Trial Information.',
        title: 'This case has been set for trial',
      },
    });
  });

  it('gets notice generation success message for electronic cases', async () => {
    const result = await runAction(getNoticeGenerationSuccessMessageAction, {
      state: {
        currentPage: 'CaseDetailExternal',
      },
    });

    expect(result.output).toEqual({
      alertSuccess: {
        message: 'You can view all cases set for this trial session below.',
        title: 'Eligible cases have been set for this trial session.',
      },
    });
  });
});
