import { runAction } from 'cerebral/test';
import { setSectionInboxMessageCountAction } from './setSectionInboxMessageCountAction';

describe('setSectionInboxMessageCountAction', () => {
  it('sets the section inbox message count', async () => {
    const result = await runAction(setSectionInboxMessageCountAction, {
      props: {
        messages: [
          { messageId: 'message-id-1' },
          { messageId: 'message-id-2' },
        ],
      },
    });

    expect(result.state.messagesSectionCount).toEqual(2);
  });

  it('sets the section inbox message count to 0 if nothing was provided', async () => {
    const result = await runAction(setSectionInboxMessageCountAction, {
      props: {},
    });

    expect(result.state.messagesSectionCount).toEqual(0);
  });
});
