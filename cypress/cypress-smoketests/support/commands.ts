import 'cypress-file-upload';
import { getEnvironmentSpecificFunctions } from './environment-specific-factory';

const { login } = getEnvironmentSpecificFunctions();

Cypress.Commands.add('goToRoute', (...args) => {
  cy.get('.progress-indicator').should('not.exist');
  return cy.window().then(w => {
    // eslint-disable-next-line no-underscore-dangle
    w.__cy_route(...args);
  });
});

Cypress.Commands.add('getByTestId', (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`);
});

Cypress.Commands.add('login', (username, route = '/') => {
  login(`${username}@example.com`, route);
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
