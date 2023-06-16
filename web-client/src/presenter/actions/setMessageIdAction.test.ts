import { runAction } from '@web-client/presenter/test.cerebral';
import { setMessageIdAction } from './setMessageIdAction';

describe('setMessageIdAction', () => {
  const messageId = '41f0bd45-4215-4299-9db2-6227d0e1635a';

  it('sets the state.currentViewMetadata.messageId based on the props.messageId passed in', async () => {
    const { state } = await runAction(setMessageIdAction, {
      props: { messageId },
      state: {},
    });

    expect(state.currentViewMetadata.messageId).toEqual(messageId);
  });
});
