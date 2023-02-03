import { menuHelper } from './menuHelper';
import { runCompute } from 'cerebral/test';

describe('menuHelper', () => {
  it('should return false for each menu by default', () => {
    const { isAccountMenuOpen } = runCompute(menuHelper, {});
    const { isReportsMenuOpen } = runCompute(menuHelper, {});
    const { isCaseDetailMenuOpen } = runCompute(menuHelper, {});

    expect(isAccountMenuOpen).toEqual(false);
    expect(isReportsMenuOpen).toEqual(false);
    expect(isCaseDetailMenuOpen).toEqual(false);
  });

  it('should indicate Account Menu is open according to state', () => {
    const { isAccountMenuOpen } = runCompute(menuHelper, {
      state: {
        navigation: {
          openMenu: 'AccountMenu',
        },
      },
    });

    expect(isAccountMenuOpen).toEqual(true);
  });

  it('should indicate Reports Menu is open according to state', () => {
    const { isReportsMenuOpen } = runCompute(menuHelper, {
      state: {
        navigation: {
          openMenu: 'ReportsMenu',
        },
      },
    });

    expect(isReportsMenuOpen).toEqual(true);
  });

  it('should indicate Case Detail Menu is open according to state', () => {
    const { isCaseDetailMenuOpen } = runCompute(menuHelper, {
      state: {
        navigation: {
          caseDetailMenu: 'CaseDetailMenu',
        },
      },
    });

    expect(isCaseDetailMenuOpen).toEqual(true);
  });
});
