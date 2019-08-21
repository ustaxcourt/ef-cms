import { menuHelper } from './menuHelper';
import { runCompute } from 'cerebral/test';

describe('menuHelper', () => {
  it('should return false for isAccountMenuOpen and isReportsMenuOpen by default', () => {
    const { isAccountMenuOpen } = runCompute(menuHelper, {});
    const { isReportsMenuOpen } = runCompute(menuHelper, {});

    expect(isAccountMenuOpen).toEqual(false);
    expect(isReportsMenuOpen).toEqual(false);
  });

  it('should return result of state.isAccountMenuOpen', () => {
    const { isAccountMenuOpen } = runCompute(menuHelper, {
      state: {
        isAccountMenuOpen: true,
      },
    });

    expect(isAccountMenuOpen).toEqual(true);
  });

  it('should return result of state.isReportsMenuOpen', () => {
    const { isReportsMenuOpen } = runCompute(menuHelper, {
      state: {
        isReportsMenuOpen: true,
      },
    });

    expect(isReportsMenuOpen).toEqual(true);
  });
});
