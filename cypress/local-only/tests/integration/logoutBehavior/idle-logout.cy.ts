import {
  IdleLogoutTesting,
  overrideIdleTimeouts,
} from '../../../support/idleLogoutHelpers';
import { loginAsColvin } from '../../../../helpers/authentication/login-as-helpers';
import { retry } from '../../../../helpers/retry';

describe('Idle Logout Behavior', () => {
  it('should automatically log user out after refresh with option to log back in', () => {
    const sessionTimeout = 1000;
    const areYouStillThereTime = 500;

    loginAsColvin();
    cy.reload(); // Refresh ensures we track idle time even without interaction on the page
    cy.get('[data-testid="header-text"]');
    cy.window().then((window: Window) => {
      overrideIdleTimeouts({
        areYouStillThereTime,
        sessionTimeout,
        windowObj: window as unknown as IdleLogoutTesting,
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
    const sessionTimeout = 31000;
    const areYouStillThereTime = 25000;
    loginAsColvin();
    cy.get('[data-testid="header-text"]');
    cy.window().then((window: Window) => {
      overrideIdleTimeouts({
        areYouStillThereTime, // We want the modal to appear relatively quickly, but we do not want to sign out
        sessionTimeout,
        windowObj: window as unknown as IdleLogoutTesting,
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
});
