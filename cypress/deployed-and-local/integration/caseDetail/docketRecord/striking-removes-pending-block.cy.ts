import { loginAsDocketClerk1 } from 'cypress/helpers/authentication/login-as-helpers';
import { createAndServePaperFiling } from 'cypress/helpers/caseDetail/docketRecord/paperFiling/create-and-serve-paper-filing';
import { goToCase } from 'cypress/helpers/caseDetail/go-to-case';
import { createAndServePaperPetition } from 'cypress/helpers/fileAPetition/create-and-serve-paper-petition';

describe('Striking removes pending items', () => {
  beforeEach(() => {
    createAndServePaperPetition().then(({ docketNumber }) => {
      cy.wrap(docketNumber).as('DOCKET_NUMBER');
    });
  });

  it('Should remove the case block when striking the only pending item.', () => {
    loginAsDocketClerk1();
    cy.get<string>('@DOCKET_NUMBER').then(docketNumber => {
      goToCase(docketNumber);
      cy.get('[data-testid="edit-APW"]').click();
      cy.get('[data-testid="save-edit-docket-entry-meta"]').click();
      cy.get('[data-testid="blocked-case-icon"]').should('exist'); // Assert case is blocked

      // Strike APW
      cy.get('[data-testid="edit-APW"]').click();
      cy.get('[data-testid="tab-action"]').click();
      cy.get('[data-testid="strike-entry"]').should('be.visible').click();
      cy.get('[data-testid="modal-button-confirm"]')
        .should('be.visible')
        .click();

      cy.get('[data-testid="edit-APW"]'); // Wait for page to be fully loaded before next assert
      cy.get('[data-testid="blocked-case-icon"]').should('not.exist'); // Assert case is not blocked
    });
  });

  it('Should not remove the case block when striking one of multiple pending items.', () => {
    loginAsDocketClerk1();
    cy.get<string>('@DOCKET_NUMBER').then(docketNumber => {
      goToCase(docketNumber);
      cy.get('[data-testid="edit-APW"]').click();
      cy.get('[data-testid="save-edit-docket-entry-meta"]').click();
      cy.get('[data-testid="blocked-case-icon"]').should('exist'); // Assert case is blocked

      createAndServePaperFiling({
        dateReceived: '01/01/2022',
        documentType: 'Motion to Proceed Remotely',
      });

      // Strike APW
      cy.get('[data-testid="edit-APW"]').click();
      cy.get('[data-testid="tab-action"]').click();
      cy.get('[data-testid="strike-entry"]').should('be.visible').click();
      cy.get('[data-testid="modal-button-confirm"]')
        .should('be.visible')
        .click();

      cy.get('[data-testid="blocked-case-icon"]').should('exist'); // Assert case is blocked
    });
  });

  it('Should remove the case block when striking all pending items', () => {
    loginAsDocketClerk1();
    cy.get<string>('@DOCKET_NUMBER').then(docketNumber => {
      goToCase(docketNumber);
      cy.get('[data-testid="edit-APW"]').click();
      cy.get('[data-testid="save-edit-docket-entry-meta"]').click();
      cy.get('[data-testid="blocked-case-icon"]').should('exist'); // Assert case is blocked

      createAndServePaperFiling({
        dateReceived: '01/01/2022',
        documentType: 'Motion to Proceed Remotely',
      });

      //Strike APW
      cy.get('[data-testid="edit-APW"]').click();
      cy.get('[data-testid="tab-action"]').click();
      cy.get('[data-testid="strike-entry"]').should('be.visible').click();
      cy.get('[data-testid="modal-button-confirm"]')
        .should('be.visible')
        .click();

      cy.get('[data-testid="blocked-case-icon"]').should('exist'); // Assert case is still blocked

      //Strike MOTR
      cy.get('[data-testid="edit-MOTR"]').click();
      cy.get('[data-testid="tab-action"]').click();
      cy.get('[data-testid="strike-entry"]').should('be.visible').click();
      cy.get('[data-testid="modal-button-confirm"]')
        .should('be.visible')
        .click();

      cy.get('[data-testid="edit-APW"]'); // Wait for page to be fully loaded before next assert
      cy.get('[data-testid="blocked-case-icon"]').should('not.exist'); // Assert case is not blocked
    });
  });
});
