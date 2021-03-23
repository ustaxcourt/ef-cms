import { runAction } from 'cerebral/test';
import { setMessageInboxPropsAction } from './setMessageInboxPropsAction';

describe('setMessageInboxPropsAction', () => {
  it('sets the props so that message inbox is shown', async () => {
    const { output } = await runAction(setMessageInboxPropsAction, {
      props: {},
    });

    expect(output).toEqual({ box: 'inbox', queue: 'my' });
  });
});
