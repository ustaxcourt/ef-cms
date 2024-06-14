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
