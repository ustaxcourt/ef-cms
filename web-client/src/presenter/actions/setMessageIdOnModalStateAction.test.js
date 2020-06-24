import { runAction } from 'cerebral/test';
import { setMessageIdOnModalStateAction } from './setMessageIdOnModalStateAction';

describe('setMessageIdOnModalStateAction', () => {
  it('sets state.messageId from props', async () => {
    const { state } = await runAction(setMessageIdOnModalStateAction, {
      props: {
        messageId: '3cdd15c9-57f4-4f62-b46a-aa2ce953624d',
      },
    });

    expect(state.modal.messageId).toEqual(
      '3cdd15c9-57f4-4f62-b46a-aa2ce953624d',
    );
  });
});
