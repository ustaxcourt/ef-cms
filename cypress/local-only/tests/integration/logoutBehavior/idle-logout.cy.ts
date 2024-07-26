/* eslint-disable jest/no-commented-out-tests */
import { IWindowWithCerebralExposed } from '../../../../../types/IWindow';
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
        windowObj: window as unknown as IWindowWithCerebralExposed,
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

  it('should sign out of all tabs after idle', () => {
    // Note that throughout this test, we interact with the first tab via cypress
    // and all other tabs through the puppeteer plugin. Mixing this up will cause errors.

    loginAsColvin();
    const urls = [
      'http://localhost:1234/messages/my/inbox',
      'http://localhost:1234/document-qc/section/inbox',
      'http://localhost:1234/trial-sessions',
    ];
    urls.forEach(url =>
      cy.puppeteer(
        'openNewTab',
        url,
        DEFAULT_IDLE_TIMEOUT,
        DEFAULT_IDLE_TIMEOUT,
      ),
    );
    cy.window().then((window: Window) => {
      overrideIdleTimeouts({
        modalTimeout: DEFAULT_IDLE_TIMEOUT,
        sessionTimeout: DEFAULT_IDLE_TIMEOUT,
        windowObj: window as unknown as IWindowWithCerebralExposed,
      });
    });

    // We sync all the tabs to timeout at the same time by clicking, which broadcasts a "last active" time across tabs
    // This is to check for race conditions
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
