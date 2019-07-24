import { closeAccountMenuAction } from './closeAccountMenuAction';
import { runAction } from 'cerebral/test';

describe('closeAccountMenuAction', () => {
  it('sets state.isAccountMenuOpen to false', async () => {
    const { state } = await runAction(closeAccountMenuAction, {
      props: {},
      state: {
        isAccountMenuOpen: true,
      },
    });
    expect(state.isAccountMenuOpen).toBeFalsy();
  });
});
