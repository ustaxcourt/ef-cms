import { When } from '@badeball/cypress-cucumber-preprocessor';

When('I update my email to {string}', (username: string) => {
  cy.get('[data-testid="account-menu-button"]').click();
  cy.get('[data-testid="my-account-link"]').click();
  cy.get('[data-testid="change-email-button"]').click();
  cy.get('[data-testid="change-login-email-input"]').type(
    `${username}@example.com`,
  );
  cy.get('[data-testid="confirm-change-login-email-input"]').type(
    `${username}@example.com`,
  );
  cy.get('[data-testid="save-change-login-email-button"]').click();
  cy.get('[data-testid="modal-button-confirm"]').click();
});

When(
  'I verify my updated email of {string} and old email of {string}',
  (updatedUsername: string, oldUsername: string) => {
    cy.task('getEmailVerificationToken', {
      email: `${oldUsername}@example.com`,
    }).then(verificationToken => {
      cy.visit(`/verify-email?token=${verificationToken}`);
    });

    cy.get('[data-testid="success-alert"]')
      .should('be.visible')
      .and(
        'contain.text',
        'Your email address is verified. You can now log in to DAWSON.',
      );
    cy.url().should('contain', '/login');
    cy.login(updatedUsername);
  },
);
