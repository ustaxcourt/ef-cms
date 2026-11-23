import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsPetitionsClerk } from '../../../../helpers/authentication/login-as-helpers';

describe('Message Detail - Petitions Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsPetitionsClerk();
    cy.visit(
      '/messages/105-20/message-detail/eb0a139a-8951-4de1-8b83-f02a27504105',
    );
    cy.contains('Message');

    checkA11y();
  });

  it('should be free of a11y issues when forwarding', () => {
    loginAsPetitionsClerk();
    cy.visit(
      '/messages/105-20/message-detail/eb0a139a-8951-4de1-8b83-f02a27504105',
    );
    cy.get('#button-forward').click();
    cy.get('.modal-dialog').should('exist');

    checkA11y();
  });

  it('should be free of a11y issues when replying', () => {
    loginAsPetitionsClerk();
    cy.visit(
      '/messages/105-20/message-detail/eb0a139a-8951-4de1-8b83-f02a27504105',
    );
    cy.get('#button-reply').click();
    cy.get('.modal-dialog').should('exist');

    checkA11y();
  });

  it('should be free of a11y issues when replying with an attachment', () => {
    loginAsPetitionsClerk();
    cy.visit(
      '/messages/103-20/message-detail/1d4c1fd9-5265-4e46-894f-b8426d3a6836',
    );
    cy.get('#button-reply').click();
    cy.get('.modal-dialog').should('exist');
    cy.get(
      '[data-testid="open-message-attachment-document-4796a931-14fb-43e6-948f-d2b67ce4c1cb"]',
    ).should('exist');

    checkA11y();
  });

  it('should be free of a11y issues when completing', () => {
    loginAsPetitionsClerk();
    cy.visit(
      '/messages/105-20/message-detail/eb0a139a-8951-4de1-8b83-f02a27504105',
    );
    cy.get('#button-complete').click();
    cy.get('.modal-dialog').should('exist');

    checkA11y();
  });
});
