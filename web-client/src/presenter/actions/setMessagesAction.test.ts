import { runAction } from '@web-client/presenter/test.cerebral';
import { setMessagesAction } from './setMessagesAction';

describe('setMessagesAction', () => {
  const message = {
    messageId: '180bfc0c-4e8e-448a-802a-8fe027be85ef',
  };

  it('sets props.messages on state.messages', async () => {
    const results = await runAction(setMessagesAction, {
      props: { messages: [message] },
      state: {},
    });
    expect(results.state.messages).toEqual([message]);
  });
});
