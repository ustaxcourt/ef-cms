import { runAction } from 'cerebral/test';
import { setInboxMessageCountAction } from './setInboxMessageCountAction';

describe('setInboxMessageCountAction', () => {
  it('sets the user inbox message count', async () => {
    const result = await runAction(setInboxMessageCountAction, {
      props: {
        messages: [
          { messageId: 'message-id-1' },
          { messageId: 'message-id-2' },
        ],
      },
    });

    expect(result.state.messagesInboxCount).toEqual(2);
  });

  it('sets the user inbox message count to 0 if nothing was provided', async () => {
    const result = await runAction(setInboxMessageCountAction, {
      props: {},
    });

    expect(result.state.messagesInboxCount).toEqual(0);
  });
});
