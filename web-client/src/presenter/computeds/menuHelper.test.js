import { menuHelper } from './menuHelper';
import { runCompute } from 'cerebral/test';

describe('menuHelper', () => {
  it('should return false by default', () => {
    const { isAccountMenuOpen } = runCompute(menuHelper, {});

    expect(isAccountMenuOpen).toEqual(false);
  });

  it('should return result of state.isAccountMenuOpen', () => {
    const { isAccountMenuOpen } = runCompute(menuHelper, {
      state: {
        isAccountMenuOpen: true,
      },
    });

    expect(isAccountMenuOpen).toEqual(true);
  });
});
