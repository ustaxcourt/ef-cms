import { ITestableWindow } from '../../../../helpers/ITestableWindow';
import { loginAsColvin } from '../../../../helpers/authentication/login-as-helpers';
import { overrideIdleTimeouts } from '../../../support/idleLogoutHelpers';
import { retry } from '../../../../helpers/retry';

describe('Idle Logout Behavior', () => {
  const DEFAULT_IDLE_TIMEOUT = 500;
  it('should automatically log user out after refresh with option to log back in', () => {
    loginAsColvin();
    cy.reload(); // Refresh ensures we track idle time even without interaction on the page
    cy.get('[data-testid="header-text"]');
    cy.window().then((window: Window) => {
      overrideIdleTimeouts({
        modalTimeout: DEFAULT_IDLE_TIMEOUT,
        sessionTimeout: DEFAULT_IDLE_TIMEOUT,
        windowObj: window as unknown as ITestableWindow,
      });
    });

    retry(() => {
      return cy.get('body').then(body => {
        return body.find('[data-testid="idle-logout-login-button"]').length > 0;
      });
    });

    cy.get('[data-testid="idle-logout-login-button"]').click();
    cy.get('[data-testid="login-button"]').should('exist');
  });

  it('should close modal in other tab when loading new tab', () => {
    loginAsColvin();
    cy.get('[data-testid="header-text"]');
    cy.window().then((window: Window) => {
      overrideIdleTimeouts({
        modalTimeout: 30000, // We want the modal to appear relatively quickly, but we do not want to sign out
        sessionTimeout: 1000,
        windowObj: window as unknown as ITestableWindow,
      });
    });

    // Wait until modal is there
    cy.get('[data-testid="are-you-still-there-modal"]').should('exist');

    const newTabUrl = Cypress.config('baseUrl') + '/messages/my/inbox';
    cy.puppeteer('openNewTab', newTabUrl);

    // Then confirm opening a new tab closed the modal
    cy.get('[data-testid="are-you-still-there-modal"]').should('not.exist');
    cy.puppeteer('closeTab', newTabUrl);
  });

  it('should sign out of all tabs after idle', () => {
    // Note that throughout this test, we interact with the first tab via cypress
    // and all other tabs through the puppeteer plugin. Mixing this up will cause errors.

    loginAsColvin();
    const urls = [
      '/messages/my/inbox',
      '/document-qc/section/inbox',
      '/trial-sessions',
    ];
    urls.forEach(url => {
      cy.puppeteer(
        'openNewTab',
        Cypress.config('baseUrl') + url,
        DEFAULT_IDLE_TIMEOUT,
        DEFAULT_IDLE_TIMEOUT,
      );
    });
    cy.window().then((window: Window) => {
      overrideIdleTimeouts({
        modalTimeout: DEFAULT_IDLE_TIMEOUT,
        sessionTimeout: DEFAULT_IDLE_TIMEOUT,
        windowObj: window as unknown as ITestableWindow,
      });
    });

    // We sync all the tabs to timeout at the same time by clicking, which broadcasts a "last active" time across tabs.
    // They should all sign out at the same time.
    cy.get('body').click();

    cy.get('[data-testid="idle-logout-login-button"]').should('exist');
    urls.forEach(url =>
      cy.puppeteer(
        'openExistingTabAndCheckSelectorExists',
        url,
        '[data-testid="idle-logout-login-button"]',
      ),
    );
  });
});
