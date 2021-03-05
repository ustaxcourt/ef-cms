import { clearOpenMenuAction } from './clearOpenMenuAction';
import { runAction } from 'cerebral/test';

describe('clearOpenMenuAction', () => {
  it('clears state.navigation.openMenu', async () => {
    const result = await runAction(clearOpenMenuAction, {
      state: {
        form: {
          navigation: {
            openMenu: 'wow',
          },
        },
      },
    });

    expect(result.state.navigation.openMenu).toBeUndefined();
  });
});
