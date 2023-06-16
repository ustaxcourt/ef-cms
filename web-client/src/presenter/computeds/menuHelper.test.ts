import { menuHelper } from './menuHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';

describe('menuHelper', () => {
  it('should return false for each menu by default', () => {
    const { isAccountMenuOpen } = runCompute(menuHelper, {});
    const { isReportsMenuOpen } = runCompute(menuHelper, {});
    const { isMessagesMenuOpen } = runCompute(menuHelper, {});
    const { isDocumentQCMenuOpen } = runCompute(menuHelper, {});
    const { isCaseDetailMenuOpen } = runCompute(menuHelper, {});

    expect(isMessagesMenuOpen).toEqual(false);
    expect(isAccountMenuOpen).toEqual(false);
    expect(isReportsMenuOpen).toEqual(false);
    expect(isCaseDetailMenuOpen).toEqual(false);
    expect(isDocumentQCMenuOpen).toEqual(false);
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

  it('should indicate Messages Menu is open according to state', () => {
    const { isMessagesMenuOpen } = runCompute(menuHelper, {
      state: {
        navigation: {
          openMenu: 'MessagesMenu',
        },
      },
    });

    expect(isMessagesMenuOpen).toEqual(true);
  });

  it('should indicate Document QC Menu is open according to state', () => {
    const { isDocumentQCMenuOpen } = runCompute(menuHelper, {
      state: {
        navigation: {
          openMenu: 'DocumentQCMenu',
        },
      },
    });

    expect(isDocumentQCMenuOpen).toEqual(true);
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
