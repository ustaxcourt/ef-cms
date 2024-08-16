import { runAction } from '@web-client/presenter/test.cerebral';
import { unsetParentMessageIdAction } from './unsetParentMessageIdAction';

describe('unsetParentMessageIdAction,', () => {
  it('should unset parent message id', async () => {
    const result = await runAction(unsetParentMessageIdAction, {
      state: { parentMessageId: 'test' },
    });

    expect(result.state.parentMessageId).toBeUndefined();
  });
});
