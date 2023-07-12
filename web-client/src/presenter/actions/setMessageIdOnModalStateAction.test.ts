import { runAction } from '@web-client/presenter/test.cerebral';
import { setMessageIdOnModalStateAction } from './setMessageIdOnModalStateAction';

describe('setMessageIdOnModalStateAction', () => {
  it('sets state.parentMessageId from props', async () => {
    const { state } = await runAction(setMessageIdOnModalStateAction, {
      props: {
        parentMessageId: '3cdd15c9-57f4-4f62-b46a-aa2ce953624d',
      },
    });

    expect(state.modal.parentMessageId).toEqual(
      '3cdd15c9-57f4-4f62-b46a-aa2ce953624d',
    );
  });
});
