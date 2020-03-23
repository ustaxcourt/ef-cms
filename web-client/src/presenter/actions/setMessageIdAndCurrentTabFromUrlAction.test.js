import { runAction } from 'cerebral/test';

import { setMessageIdAndCurrentTabFromUrlAction } from './setMessageIdAndCurrentTabFromUrlAction';

describe('setMessageIdAndCurrentTabFromUrlAction', () => {
  it('Sets state.messageId based on props.messageId', async () => {
    const result = await runAction(setMessageIdAndCurrentTabFromUrlAction, {
      props: {
        messageId: '123',
      },
      state: {
        currentViewMetadata: {
          messageId: '',
        },
      },
    });
    expect(result.state.currentViewMetadata.messageId).toEqual('123');
  });

  it('Sets state.currentTab to Messages if props.messageId is set', async () => {
    const result = await runAction(setMessageIdAndCurrentTabFromUrlAction, {
      props: {
        messageId: '123',
      },
      state: {
        currentViewMetadata: {
          currentTab: '',
          messageId: '',
        },
      },
    });
    expect(result.state.currentViewMetadata.tab).toEqual('Messages');
  });

  it('resets the messageId to null if not already set', async () => {
    const result = await runAction(setMessageIdAndCurrentTabFromUrlAction, {
      props: {
        messageId: null,
      },
      state: {
        currentViewMetadata: {
          currentTab: '',
          messageId: 'abc',
        },
      },
    });
    expect(result.state.currentViewMetadata.tab).toEqual('');
    expect(result.state.currentViewMetadata.messageId).toEqual(null);
  });
});
