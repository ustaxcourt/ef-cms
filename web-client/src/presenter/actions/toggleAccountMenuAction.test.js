import { runAction } from 'cerebral/test';
import { toggleAccountMenuAction } from './toggleAccountMenuAction';

describe('toggleAccountMenuAction', () => {
  it('sets state.isAccountMenuOpen to false when it was previously true', async () => {
    const { state } = await runAction(toggleAccountMenuAction, {
      state: {
        isAccountMenuOpen: true,
      },
    });
    expect(state.isAccountMenuOpen).toBeFalsy();
  });

  it('sets state.isAccountMenuOpen to true when it was previously false', async () => {
    const { state } = await runAction(toggleAccountMenuAction, {
      state: {
        isAccountMenuOpen: false,
      },
    });
    expect(state.isAccountMenuOpen).toBeTruthy();
  });
});
