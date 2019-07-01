import { runAction } from 'cerebral/test';

import { setMessageIdAndCurrentTabFromUrlAction } from './setMessageIdAndCurrentTabFromUrlAction';

describe('setMessageIdAndCurrentTabFromUrlAction', () => {
  it('Sets state.messageId based on props.messageId', async () => {
    const result = await runAction(setMessageIdAndCurrentTabFromUrlAction, {
      props: {
        messageId: '123',
      },
      state: {
        messageId: '',
      },
    });
    expect(result.state.messageId).toEqual('123');
  });

  it('Sets state.currentTab to Messages if props.messageId is set', async () => {
    const result = await runAction(setMessageIdAndCurrentTabFromUrlAction, {
      props: {
        messageId: '123',
      },
      state: {
        currentTab: '',
        messageId: '',
      },
    });
    expect(result.state.currentTab).toEqual('Messages');
  });

  it('Does NOT modify state if props.messageId is NOT set', async () => {
    const result = await runAction(setMessageIdAndCurrentTabFromUrlAction, {
      props: {
        messageId: null,
      },
      state: {
        currentTab: '',
        messageId: '',
      },
    });
    expect(result.state.currentTab).toEqual('');
    expect(result.state.messageId).toEqual('');
  });
});
