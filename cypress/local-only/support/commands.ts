import '../../support/commands/keepAliases';
import 'cypress-file-upload';
import { getCypressEnv } from '../../helpers/env/cypressEnvironment';
import { impactLevel } from '../../helpers/accessibility-impact';
import { terminalLog } from '../../helpers/cypressTasks/logs';
('../../helpers/cypressTasks/logs');

Cypress.Commands.add('showsErrorMessage', (shows = true) => {
  if (shows) {
    cy.get('.usa-alert-error').should('exist');
  } else {
    cy.get('.usa-alert-error').should('not.exist');
  }
});

Cypress.Commands.add('showsSpinner', (shows = true) => {
  if (shows) {
    cy.get('.progress-indicator').should('exist');
  } else {
    cy.get('.progress-indicator').should('not.exist');
  }
});

Cypress.Commands.add('listDownloadedFiles', directory => {
  return cy
    .exec(`ls ${directory}`)
    .its('stdout')
    .then(stdout => stdout.split('\n').filter(Boolean));
});

Cypress.Commands.add('showsSuccessMessage', (shows = true) => {
  if (shows) {
    cy.get('.usa-alert--success').should('exist');
  } else {
    cy.get('.usa-alert--success').should('not.exist');
  }
});

Cypress.Commands.add('login', (username, route = '/') => {
  Cypress.session.clearCurrentSessionData();

  cy.visit('/login');
  cy.get('[data-testid="email-input"]').type(`${username}@example.com`);
  cy.get('[data-testid="password-input"]').type(
    getCypressEnv().defaultAccountPass,
  );
  cy.get('[data-testid="login-button"]').click();
  cy.get('[data-testid="account-menu-button"]');
  cy.visit(route);

  cy.window().then(win =>
    win.localStorage.setItem('__cypressOrderInSameTab', 'true'),
  );
});

Cypress.Commands.add('goToRoute', (...args) => {
  cy.get('.progress-indicator').should('not.exist');
  return cy.window().then(w => {
    // eslint-disable-next-line no-underscore-dangle
    w.__cy_route(...args);
  });
});

Cypress.Commands.add('unzipFile', downloadPath => {
  cy.task('unzipFile', downloadPath).then(unzippedFiles => {
    return cy.wrap(unzippedFiles);
  });
});

Cypress.Commands.add('waitUntilSettled', (maxTries = 20) => {
  let didDOMChange = false;
  let consecutiveIdleCallbacksWithUnchangedDOM = 0;

  const handleMutation = () => {
    didDOMChange = true;
  };

  const observer = new MutationObserver(handleMutation);

  cy.document().then(doc => {
    observer.observe(doc.body, { childList: true, subtree: true });
  });

  /**
   *
   */
  function waitAndSee(iteration: number) {
    didDOMChange = false;

    const thenTimeout = 8000;

    cy.window({ log: false })
      .then(
        { timeout: thenTimeout },
        win =>
          new Cypress.Promise(resolve =>
            win.requestIdleCallback(resolve, { timeout: thenTimeout / 2 }),
          ),
      )
      .then(() => {
        if (didDOMChange) {
          if (iteration >= maxTries) {
            throw new Error('DOM did not settle');
          }

          consecutiveIdleCallbacksWithUnchangedDOM = 0;
          waitAndSee(iteration + 1);
        } else if (consecutiveIdleCallbacksWithUnchangedDOM <= 1) {
          consecutiveIdleCallbacksWithUnchangedDOM += 1;
          waitAndSee(iteration);
        }
      });
  }

  waitAndSee(0);
});

Cypress.Commands.add('runA11y', () => {
  cy.injectAxe();

  cy.checkA11y(
    undefined,
    {
      includedImpacts: impactLevel,
      retries: 3,
      rules: {
        'nested-interactive': { enabled: false }, // https://github.com/flexion/ef-cms/issues/10396
      },
    },
    terminalLog,
  );
});

export {};

declare global {
  namespace Cypress {
    interface Chainable {
      login: (
        username: string,
        path?: string,
      ) => Chainable<JQuery<HTMLElement>>;
      waitUntilSettled: (maxTries?: number) => void;
      showsErrorMessage: (shows?: boolean) => void;
      showsSuccessMessage: (shows?: boolean) => void;
      listDownloadedFiles: (directory: string) => Chainable<string[]>;
      unzipFile: (pathInfo: {
        destinationPath: string;
        filePath: string;
      }) => Chainable<string[]>;
      showsSpinner: (shows?: boolean) => void;
      waitAndSee: (iteration: number) => void;
      goToRoute: (args: any) => void;
      keepAliases: (args?: string[]) => void;
      runA11y: () => void;
    }
  }
}
