import { removeIrsNoticeFromFormAction } from '@web-client/presenter/actions/removeIrsNoticeFromFormAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('removeIrsNoticeFromFormAction', () => {
  it('should slice the array in state correctly', async () => {
    const { state } = await runAction(removeIrsNoticeFromFormAction, {
      props: {
        index: 2,
      },
      state: {
        irsNoticeUploadFormInfo: [1, 2, 3, 4, 5, 6],
      },
    });
    expect(state.irsNoticeUploadFormInfo).toEqual([1, 2, 4, 5, 6]);
  });

  it('should leave the array in state untouched if the index is under 0', async () => {
    const { state } = await runAction(removeIrsNoticeFromFormAction, {
      props: {
        index: -2,
      },
      state: {
        irsNoticeUploadFormInfo: [1, 2, 3, 4, 5, 6],
      },
    });
    expect(state.irsNoticeUploadFormInfo).toEqual([1, 2, 3, 4, 5, 6]);
  });
});
