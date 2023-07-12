import { getNoticeGenerationSuccessMessageAction } from './getNoticeGenerationSuccessMessageAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getNoticeGenerationSuccessMessageAction', () => {
  it('gets notice generation success message for paper cases', async () => {
    const result = await runAction(getNoticeGenerationSuccessMessageAction, {
      state: {
        currentPage: 'CaseDetailInternal',
      },
    });

    expect(result.output).toEqual({
      alertSuccess: {
        message: 'Case set for trial.',
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
        message: 'Eligible cases set for trial.',
      },
    });
  });
});
