import { runAction } from 'cerebral/test';
import { setCaseMessagesAction } from './setCaseMessagesAction';

describe('setCaseMessagesAction', () => {
  const message = {
    messageId: '180bfc0c-4e8e-448a-802a-8fe027be85ef',
  };

  it('sets props.messages on state.messages', async () => {
    const results = await runAction(setCaseMessagesAction, {
      props: { messages: [message] },
      state: {},
    });
    expect(results.state.messages).toEqual([message]);
  });
});
