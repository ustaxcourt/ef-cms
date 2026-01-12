export function retry(cb: () => Cypress.Chainable<boolean>, maxAttempts = 5) {
  if (maxAttempts > 0) {
    cb().then((isDone: boolean) => {
      if (!isDone) {
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(2000);
        retry(cb, maxAttempts - 1);
      } else {
        cy.log('retry condition passed, found expected elements');
      }
    });
  } else {
    throw new Error('cypress failed to successfully run a retry block');
  }
}

export function assertExists(selector: string) {
  /*
   This is a necessary wait as the below find command does not have built in cypress retries. 
   This makes the below command VERY flaky because if the browser does not have the selector the moment you look for it this fails.
   This function should only ever be used with the retry() mechanism.
  */
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(2000);
  return cy.get('body').then(body => {
    return body.find(selector).length > 0;
  });
}

export function assertDoesNotExist(selector: string) {
  return cy.get('body').then(body => {
    return body.find(selector).length === 0;
  });
}
