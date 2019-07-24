import { accountMenuHelper } from './accountMenuHelper';
import { runCompute } from 'cerebral/test';

describe('accountMenuHelper', () => {
  it('should return false by default', () => {
    const { isMenuOpen } = runCompute(accountMenuHelper, {});

    expect(isMenuOpen).toEqual(false);
  });

  it('should return result of state.isAccountMenuOpen', () => {
    const { isMenuOpen } = runCompute(accountMenuHelper, {
      state: {
        isAccountMenuOpen: true,
      },
    });

    expect(isMenuOpen).toEqual(true);
  });
});
