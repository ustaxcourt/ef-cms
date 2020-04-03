import { runAction } from 'cerebral/test';
import { setFocusedWorkItemAction } from './setFocusedWorkItemAction';

describe('setFocusedWorkItemAction', () => {
  it('marks the item in the given queue as focused if it matches the props.uiKey', async () => {
    const { state } = await runAction(setFocusedWorkItemAction, {
      props: {
        queueType: 'testQueue',
        uiKey: 'a',
      },
      state: {
        testQueue: [
          {
            isFocused: false,
            uiKey: 'c',
          },
          {
            isFocused: false,
            uiKey: 'b',
          },
          {
            isFocused: false,
            uiKey: 'a',
          },
        ],
      },
    });

    expect(state['testQueue']).toEqual([
      {
        isFocused: false,
        uiKey: 'c',
      },
      {
        isFocused: false,
        uiKey: 'b',
      },
      {
        isFocused: true,
        uiKey: 'a',
      },
    ]);
  });
});
